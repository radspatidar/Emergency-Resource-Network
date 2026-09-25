import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config(); // Trigger restart

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ── Counter helpers ────────────────────────────────────────────────────────────
const padNum = (n: number) => String(n).padStart(3, '0');

async function nextRequestCode(): Promise<string> {
  const count = await prisma.emergencyRequest.count();
  return `ER-${padNum(count + 1)}`;
}
async function nextTripCode(): Promise<string> {
  const count = await prisma.trip.count();
  return `TRIP-${padNum(count + 1)}`;
}

// ── Activity Logger ────────────────────────────────────────────────────────────
const logActivity = async (
  action: string, module: string, description: string,
  user: string = 'System', refId?: string
) => {
  try {
    await prisma.activityLog.create({ data: { action, module, description, user, refId } });
  } catch (e) { console.error('Activity log error:', e); }
};

// =============================================================================
// AUTH
// =============================================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password && user.status === 'Active') {
      await logActivity('User Login', 'System', `${user.name} logged in`, user.name);
      return res.json({
        token: 'mock-jwt-token',
        user: {
          id: user.id, name: user.name, role: user.role,
          email: user.email, phone: user.phone,
          hospitalId: user.hospitalId, ambulanceId: user.ambulanceId
        }
      });
    }
    if (user && user.status !== 'Active') {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
  } catch (e) {
    console.warn('Database offline, using fallback');
  }

  // Fallback demo credentials
  const demos: Record<string, any> = {
    'admin@healthresq.in:admin123': { id: 'usr-admin', name: 'System Administrator', role: 'System Admin', email },
    'hospital@healthresq.in:hospital123': { id: 'usr-hospital', name: 'Dr. Priya Sharma', role: 'Hospital Admin', email, hospitalId: null },
    'coordinator@healthresq.in:coordinator123': { id: 'usr-coord', name: 'EMS Coordinator', role: 'Emergency Coordinator', email },
    'operator@healthresq.in:operator123': { id: 'usr-oper', name: 'Rahul Sharma', role: 'Ambulance Operator', email, ambulanceId: null },
  };
  const key = `${email}:${password}`;
  if (demos[key]) return res.json({ token: 'mock-jwt-token', user: demos[key] });
  return res.status(401).json({ message: 'Invalid email or password' });
});

// =============================================================================
// USERS
// =============================================================================
app.get('/api/users', async (req, res) => {
  const { search } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: search ? {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
          { role: { contains: String(search), mode: 'insensitive' } },
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospitalId: true, ambulanceId: true, createdAt: true }
    });
    return res.json(users);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, phone, hospitalId, ambulanceId, password } = req.body;
    if (!name || !email || !role) return res.status(400).json({ error: 'Name, email, and role are required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'A user with this email already exists' });
    const user = await prisma.user.create({
      data: { name, email, role, phone: phone || null, hospitalId: hospitalId || null, ambulanceId: ambulanceId || null, password: password || 'changeme123' },
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospitalId: true, ambulanceId: true, createdAt: true }
    });
    await logActivity('User Created', 'Users', `Created user ${name} (${role})`, 'System Admin');
    return res.status(201).json(user);
  } catch (e: any) { 
    console.error('Error creating user:', e);
    return res.status(500).json({ error: 'Server error', details: e?.message || String(e) }); 
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, phone, status, hospitalId, ambulanceId } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, role, phone: phone || null, status, hospitalId: hospitalId || null, ambulanceId: ambulanceId || null },
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospitalId: true, createdAt: true }
    });
    await logActivity('User Updated', 'Users', `Updated user ${name}`, 'System Admin');
    return res.json(user);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    await logActivity('User Deleted', 'Users', `Deleted user ${user.name}`, 'System Admin');
    return res.json({ message: 'User deleted successfully' });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/profile', async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const user = await prisma.user.update({
      where: { id }, data: { name, email, phone },
      select: { id: true, name: true, email: true, role: true, phone: true }
    });
    await logActivity('Profile Updated', 'System', `User ${name} updated their profile`, name);
    return res.json(user);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/profile/password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.password !== currentPassword) return res.status(401).json({ error: 'Current password is incorrect' });
    await prisma.user.update({ where: { id }, data: { password: newPassword } });
    await logActivity('Password Changed', 'System', `User ${user.name} changed their password`, user.name);
    return res.json({ message: 'Password updated successfully' });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// HOSPITALS
// =============================================================================
app.get('/api/hospitals', async (req, res) => {
  const { search } = req.query;
  try {
    const hospitals = await prisma.hospital.findMany({
      where: search ? {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { city: { contains: String(search), mode: 'insensitive' } },
          { status: { contains: String(search), mode: 'insensitive' } },
          { type: { contains: String(search), mode: 'insensitive' } },
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(hospitals);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await prisma.hospital.findUnique({ where: { id: req.params.id } });
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    return res.json(hospital);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/hospitals', async (req, res) => {
  try {
    const { name, city, type, totalBeds, availableBeds, icuBeds, availableIcu,
      ventilators, availableVentilators, oxygenUnits, availableOxygen,
      doctorsAvailable, nursesAvailable, emergencyStatus, status, contact, address } = req.body;
    if (!name || !city) return res.status(400).json({ error: 'Name and city are required' });
    const hospital = await prisma.hospital.create({
      data: {
        name, city, type: type || 'General Hospital',
        totalBeds: Number(totalBeds) || 0, availableBeds: Number(availableBeds) || 0,
        icuBeds: Number(icuBeds) || 0, availableIcu: Number(availableIcu) || 0,
        ventilators: Number(ventilators) || 0, availableVentilators: Number(availableVentilators) || 0,
        oxygenUnits: Number(oxygenUnits) || 0, availableOxygen: Number(availableOxygen) || 0,
        doctorsAvailable: Number(doctorsAvailable) || 0, nursesAvailable: Number(nursesAvailable) || 0,
        emergencyStatus: emergencyStatus || 'AVAILABLE', status: status || 'Active',
        contact: contact || null, address: address || null
      }
    });
    await logActivity('Hospital Registered', 'Hospitals', `Registered hospital ${name}`, 'System Admin');
    return res.status(201).json(hospital);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/hospitals/:id', async (req, res) => {
  try {
    const data: any = {};
    const fields = ['name','city','type','totalBeds','availableBeds','icuBeds','availableIcu',
      'ventilators','availableVentilators','oxygenUnits','availableOxygen',
      'doctorsAvailable','nursesAvailable','emergencyStatus','status','contact','address'];
    const numFields = ['totalBeds','availableBeds','icuBeds','availableIcu','ventilators',
      'availableVentilators','oxygenUnits','availableOxygen','doctorsAvailable','nursesAvailable'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        data[f] = numFields.includes(f) ? Number(req.body[f]) : req.body[f];
      }
    }
    const hospital = await prisma.hospital.update({ where: { id: req.params.id }, data });
    await logActivity('Hospital Updated', 'Hospitals', `Updated hospital ${hospital.name}`, 'Hospital Admin', hospital.id);
    return res.json(hospital);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await prisma.hospital.delete({ where: { id: req.params.id } });
    await logActivity('Hospital Deleted', 'Hospitals', `Deleted hospital ${hospital.name}`, 'System Admin');
    return res.json({ message: 'Hospital deleted successfully' });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Hospital Admin — update own resources
app.patch('/api/hospitals/:id/resources', async (req, res) => {
  try {
    const numFields = ['totalBeds','availableBeds','icuBeds','availableIcu','ventilators',
      'availableVentilators','oxygenUnits','availableOxygen','doctorsAvailable','nursesAvailable'];
    const data: any = {};
    for (const f of [...numFields, 'emergencyStatus']) {
      if (req.body[f] !== undefined) {
        data[f] = numFields.includes(f) ? Number(req.body[f]) : req.body[f];
      }
    }
    const hospital = await prisma.hospital.update({ where: { id: req.params.id }, data });
    await logActivity('Resources Updated', 'Hospitals', `Resources updated for ${hospital.name}`, 'Hospital Admin', hospital.id);
    return res.json(hospital);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// AMBULANCES
// =============================================================================
app.get('/api/ambulances', async (req, res) => {
  const { search, status } = req.query;
  try {
    const ambulances = await prisma.ambulance.findMany({
      where: {
        ...(status ? { status: String(status) } : {}),
        ...(search ? {
          OR: [
            { vehicleNo: { contains: String(search), mode: 'insensitive' } },
            { locationLabel: { contains: String(search), mode: 'insensitive' } },
            { driverName: { contains: String(search), mode: 'insensitive' } },
            { status: { contains: String(search), mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(ambulances);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/ambulances', async (req, res) => {
  try {
    const { vehicleNo, type, status, lat, lng, locationLabel, driverName, contact, hospitalId } = req.body;
    if (!vehicleNo) return res.status(400).json({ error: 'Vehicle number is required' });
    const ambulance = await prisma.ambulance.create({
      data: {
        vehicleNo, type: type || 'Basic Life Support',
        status: status || 'Available',
        lat: Number(lat) || 22.7196, lng: Number(lng) || 75.8577,
        locationLabel: locationLabel || 'Base Station',
        driverName: driverName || null, contact: contact || null, hospitalId: hospitalId || null
      }
    });
    await logActivity('Ambulance Registered', 'Ambulances', `Registered ambulance ${vehicleNo}`, 'System Admin');
    return res.status(201).json(ambulance);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Vehicle number already exists' });
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/ambulances/:id', async (req, res) => {
  try {
    const { vehicleNo, type, status, lat, lng, locationLabel, driverName, contact, hospitalId } = req.body;
    const ambulance = await prisma.ambulance.update({
      where: { id: req.params.id },
      data: {
        vehicleNo, type, status,
        lat: lat !== undefined ? Number(lat) : undefined,
        lng: lng !== undefined ? Number(lng) : undefined,
        locationLabel: locationLabel || 'Base Station',
        driverName: driverName || null, contact: contact || null, hospitalId: hospitalId || null
      }
    });
    await logActivity('Ambulance Updated', 'Ambulances', `Updated ambulance ${vehicleNo}`, 'System Admin');
    return res.json(ambulance);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/ambulances/:id', async (req, res) => {
  try {
    const ambulance = await prisma.ambulance.delete({ where: { id: req.params.id } });
    await logActivity('Ambulance Deleted', 'Ambulances', `Deleted ambulance ${ambulance.vehicleNo}`, 'System Admin');
    return res.json({ message: 'Ambulance deleted successfully' });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Operator — update location
app.patch('/api/ambulances/:id/location', async (req, res) => {
  try {
    const { lat, lng, locationLabel } = req.body;
    const ambulance = await prisma.ambulance.update({
      where: { id: req.params.id },
      data: { lat: Number(lat), lng: Number(lng), locationLabel: locationLabel || '' }
    });
    return res.json(ambulance);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// EMERGENCY REQUESTS
// =============================================================================
app.get('/api/emergencies', async (req, res) => {
  const { status, priority, search } = req.query;
  try {
    const emergencies = await prisma.emergencyRequest.findMany({
      where: {
        ...(status && status !== 'All' ? { status: String(status) } : {}),
        ...(priority && priority !== 'All' ? { priority: String(priority) } : {}),
        ...(search ? {
          OR: [
            { requestCode: { contains: String(search), mode: 'insensitive' } },
            { patientId: { contains: String(search), mode: 'insensitive' } },
            { emergencyType: { contains: String(search), mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: { trip: { include: { ambulance: true } } }
    });

    const hospitals = await prisma.hospital.findMany();
    const hospitalMap = new Map(hospitals.map(h => [h.id, h]));
    const ambulances = await prisma.ambulance.findMany();
    const ambulanceMap = new Map(ambulances.map(a => [a.id, a]));

    const enrichedEmergencies = emergencies.map(em => ({
      ...em,
      hospital: em.hospitalId ? hospitalMap.get(em.hospitalId) : null,
      ambulance: em.ambulanceId ? ambulanceMap.get(em.ambulanceId) : null
    }));

    return res.json(enrichedEmergencies);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/emergencies/:id', async (req, res) => {
  try {
    const emergency = await prisma.emergencyRequest.findUnique({
      where: { id: req.params.id },
      include: { trip: { include: { ambulance: true } } }
    });
    if (!emergency) return res.status(404).json({ error: 'Emergency not found' });

    let hospital = null;
    if (emergency.hospitalId) {
      hospital = await prisma.hospital.findUnique({ where: { id: emergency.hospitalId } });
    }
    let ambulance = null;
    if (emergency.ambulanceId) {
      ambulance = await prisma.ambulance.findUnique({ where: { id: emergency.ambulanceId } });
    }

    return res.json({
      ...emergency,
      hospital,
      ambulance
    });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/emergencies', async (req, res) => {
  try {
    const { patientId, emergencyType, location, priority, requiredResources, notes, createdBy } = req.body;
    if (!patientId || !emergencyType || !priority) {
      return res.status(400).json({ error: 'Patient ID, emergency type, and priority are required' });
    }
    const requestCode = await nextRequestCode();
    const emergency = await prisma.emergencyRequest.create({
      data: {
        requestCode, patientId, emergencyType, location: location || 'Unknown',
        priority, requiredResources: requiredResources || [], notes: notes || null,
        createdBy: createdBy || 'Coordinator', status: 'Pending'
      }
    });
    await logActivity('Emergency Created', 'Emergency', `Created emergency ${requestCode} — ${emergencyType} (${priority})`, createdBy || 'Coordinator', emergency.id);
    return res.status(201).json(emergency);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Coordinator — acknowledge emergency
app.patch('/api/emergencies/:id/acknowledge', async (req, res) => {
  try {
    const { coordinatorName } = req.body;
    const emergency = await prisma.emergencyRequest.update({
      where: { id: req.params.id },
      data: { status: 'Acknowledged' }
    });
    await logActivity('Emergency Acknowledged', 'Emergency',
      `Emergency ${emergency.requestCode} acknowledged`, coordinatorName || 'Coordinator', emergency.id);
    return res.json(emergency);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Coordinator — assign hospital + ambulance
app.post('/api/emergencies/:id/assign', async (req, res) => {
  try {
    const { hospitalId, ambulanceId, coordinatorName } = req.body;
    if (!hospitalId || !ambulanceId) return res.status(400).json({ error: 'Hospital and ambulance are required' });

    const emergency = await prisma.emergencyRequest.update({
      where: { id: req.params.id },
      data: { hospitalId, ambulanceId, status: 'Assigned' }
    });

    // Set ambulance to Busy
    await prisma.ambulance.update({ where: { id: ambulanceId }, data: { status: 'Busy' } });

    // Create a Trip record
    const tripCode = await nextTripCode();
    const trip = await prisma.trip.create({
      data: { tripCode, emergencyId: emergency.id, ambulanceId, status: 'Not Started' }
    });

    await logActivity('Assignment Confirmed', 'Emergency',
      `Emergency ${emergency.requestCode} assigned to hospital & ambulance`, coordinatorName || 'Coordinator', emergency.id);

    return res.json({ emergency, trip });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get resource matching suggestions for an emergency
app.get('/api/emergencies/:id/match', async (req, res) => {
  try {
    const emergency = await prisma.emergencyRequest.findUnique({ where: { id: req.params.id } });
    if (!emergency) return res.status(404).json({ error: 'Not found' });

    const resources = emergency.requiredResources || [];
    const needsIcu = resources.some(r => r.toLowerCase().includes('icu'));
    const needsVentilator = resources.some(r => r.toLowerCase().includes('ventilator'));
    const needsDoctor = resources.some(r => r.toLowerCase().includes('doctor'));

    const hospitals = await prisma.hospital.findMany({
      where: { status: 'Active', emergencyStatus: { not: 'FULL' } }
    });

    const matchedHospitals = hospitals.map(h => ({
      ...h,
      suitable: (!needsIcu || h.availableIcu > 0) &&
                (!needsVentilator || h.availableVentilators > 0) &&
                (!needsDoctor || h.doctorsAvailable > 0)
    }));

    const ambulances = await prisma.ambulance.findMany({
      where: { status: 'Available' }
    });

    return res.json({ hospitals: matchedHospitals, ambulances });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// TRIPS (Ambulance Operator)
// =============================================================================

// Get trip for an ambulance (operator view)
app.get('/api/trips/ambulance/:ambulanceId', async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { ambulanceId: req.params.ambulanceId, status: { not: 'Completed' } },
      include: { emergency: true, ambulance: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(trip || null);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Get incoming trips for a hospital
app.get('/api/trips/hospital/:hospitalId', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { emergency: { hospitalId: req.params.hospitalId }, status: { not: 'Completed' } },
      include: { emergency: true, ambulance: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(trips);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Operator accepts assignment
app.patch('/api/trips/:id/accept', async (req, res) => {
  try {
    const { operatorName } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { status: 'Accepted', acceptedAt: new Date() },
      include: { emergency: true }
    });
    await prisma.emergencyRequest.update({
      where: { id: trip.emergencyId }, data: { status: 'Accepted' }
    });
    await logActivity('Assignment Accepted', 'Emergency',
      `Trip ${trip.tripCode} accepted by operator`, operatorName || 'Operator', trip.emergencyId);
    return res.json(trip);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Operator starts trip
app.patch('/api/trips/:id/start', async (req, res) => {
  try {
    const { operatorName } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { status: 'In Progress', startedAt: new Date() },
      include: { emergency: true }
    });
    await prisma.emergencyRequest.update({
      where: { id: trip.emergencyId }, data: { status: 'In Progress' }
    });
    await logActivity('Trip Started', 'Emergency',
      `Trip ${trip.tripCode} started`, operatorName || 'Operator', trip.emergencyId);
    return res.json(trip);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Operator updates location (waypoint)
app.patch('/api/trips/:id/location', async (req, res) => {
  try {
    const { lat, lng, waypointIndex, operatorName } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { currentLat: Number(lat), currentLng: Number(lng), waypointIndex: Number(waypointIndex) }
    });
    await prisma.ambulance.update({
      where: { id: trip.ambulanceId }, data: { lat: Number(lat), lng: Number(lng) }
    });
    await logActivity('Location Updated', 'Emergency',
      `Location updated to ${lat}, ${lng}`, operatorName || 'Operator', trip.emergencyId);
    return res.json(trip);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Operator ends trip
app.patch('/api/trips/:id/complete', async (req, res) => {
  try {
    const { operatorName } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { status: 'Completed', completedAt: new Date() },
      include: { emergency: true }
    });
    // Set ambulance back to Available
    await prisma.ambulance.update({ where: { id: trip.ambulanceId }, data: { status: 'Available' } });
    // Set emergency to Completed
    await prisma.emergencyRequest.update({ where: { id: trip.emergencyId }, data: { status: 'Completed' } });
    await logActivity('Trip Completed', 'Emergency',
      `Trip ${trip.tripCode} completed`, operatorName || 'Operator', trip.emergencyId);
    return res.json(trip);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// Get trip history for an ambulance
app.get('/api/trips/history/:ambulanceId', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { ambulanceId: req.params.ambulanceId, status: 'Completed' },
      include: { emergency: true },
      orderBy: { completedAt: 'desc' }
    });
    return res.json(trips);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// DASHBOARD STATS
// =============================================================================
app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalHospitals, totalAmbulances, availableAmbulances, busyAmbulances,
      activeEmergencies, pendingEmergencies, assignedEmergencies, completedEmergencies
    ] = await Promise.all([
      prisma.hospital.count({ where: { status: 'Active' } }),
      prisma.ambulance.count(),
      prisma.ambulance.count({ where: { status: 'Available' } }),
      prisma.ambulance.count({ where: { status: 'Busy' } }),
      prisma.emergencyRequest.count({ where: { status: { in: ['Assigned', 'Accepted', 'In Progress'] } } }),
      prisma.emergencyRequest.count({ where: { status: 'Pending' } }),
      prisma.emergencyRequest.count({ where: { status: 'Assigned' } }),
      prisma.emergencyRequest.count({ where: { status: 'Completed' } }),
    ]);
    return res.json({
      totalHospitals, totalAmbulances, availableAmbulances, busyAmbulances,
      activeEmergencies, pendingEmergencies, assignedEmergencies, completedEmergencies
    });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// ACTIVITY LOGS
// =============================================================================
app.get('/api/activity', async (req, res) => {
  const { search, module } = req.query;
  try {
    const logs = await prisma.activityLog.findMany({
      where: {
        ...(module && module !== 'All Modules' ? { module: String(module) } : {}),
        ...(search ? { description: { contains: String(search), mode: 'insensitive' } } : {})
      },
      orderBy: { timestamp: 'desc' }
    });
    return res.json(logs);
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

// =============================================================================
// START
// =============================================================================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;


// trigger restart
 
 
