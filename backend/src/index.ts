import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Helper: log activities
const logActivity = async (action: string, module: string, description: string, user: string = 'System Admin') => {
  try {
    await prisma.activityLog.create({ data: { action, module, description, user } });
  } catch (e) {
    console.error('Activity log error:', e);
  }
};

// =========================================================
// AUTH
// =========================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
      await logActivity('User Login', 'System', `${user.name} logged in`);
      return res.json({
        token: 'mock-jwt-token',
        user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone }
      });
    }
  } catch (e) {
    console.warn('Database offline, using fallback auth logic');
  }

  // Fallback demo credentials
  if (email === 'admin@healthresq.in' && password === 'admin123') {
    return res.json({
      token: 'mock-jwt-token',
      user: { id: 'usr-admin', name: 'Dr. Priya Sharma', role: 'System Admin', email }
    });
  }
  if (email === 'hospital@healthresq.in' && password === 'hospital123') {
    return res.json({
      token: 'mock-jwt-token',
      user: { id: 'usr-hospital', name: 'Dr. Priya Sharma', role: 'Hospital Admin', email, hospital: 'City Care Hospital' }
    });
  }
  if (email === 'coordinator@healthresq.in' && password === 'coordinator123') {
    return res.json({
      token: 'mock-jwt-token',
      user: { id: 'usr-coord', name: 'EMS Coordinator', role: 'Emergency Coordinator', email }
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
});

// =========================================================
// USERS
// =========================================================
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
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospital: true, createdAt: true }
    });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, phone, hospital, password } = req.body;
    if (!name || !email || !role) return res.status(400).json({ error: 'Name, email, and role are required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'A user with this email already exists' });
    const user = await prisma.user.create({
      data: { name, email, role, phone: phone || null, hospital: hospital || null, password: password || 'changeme123' },
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospital: true, createdAt: true }
    });
    await logActivity('User Created', 'Users', `Created user ${name} (${role})`);
    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, phone, status, hospital } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, role, phone: phone || null, status, hospital: hospital || null },
      select: { id: true, name: true, email: true, role: true, phone: true, status: true, hospital: true, createdAt: true }
    });
    await logActivity('User Updated', 'Users', `Updated user ${name}`);
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    await logActivity('User Deleted', 'Users', `Deleted user ${user.name}`);
    return res.json({ message: 'User deleted successfully' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update own profile
app.put('/api/profile', async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, phone },
      select: { id: true, name: true, email: true, role: true, phone: true }
    });
    await logActivity('Profile Updated', 'System', `User ${name} updated their profile`);
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Change password
app.put('/api/profile/password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    await prisma.user.update({ where: { id }, data: { password: newPassword } });
    await logActivity('Password Changed', 'System', `User ${user.name} changed their password`);
    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// =========================================================
// HOSPITALS
// =========================================================
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
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/hospitals', async (req, res) => {
  try {
    const { name, city, type, totalBeds, availableBeds, icuBeds, availableIcu, status, contact } = req.body;
    if (!name || !city) return res.status(400).json({ error: 'Name and city are required' });
    const hospital = await prisma.hospital.create({
      data: {
        name, city, type: type || 'General Hospital',
        totalBeds: Number(totalBeds) || 0,
        availableBeds: Number(availableBeds) || 0,
        icuBeds: Number(icuBeds) || 0,
        availableIcu: Number(availableIcu) || 0,
        status: status || 'Active',
        contact: contact || null
      }
    });
    await logActivity('Hospital Registered', 'Hospitals', `Registered hospital ${name}`);
    return res.status(201).json(hospital);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/hospitals/:id', async (req, res) => {
  try {
    const { name, city, type, totalBeds, availableBeds, icuBeds, availableIcu, status, contact } = req.body;
    const hospital = await prisma.hospital.update({
      where: { id: req.params.id },
      data: {
        name, city, type,
        totalBeds: Number(totalBeds),
        availableBeds: Number(availableBeds),
        icuBeds: Number(icuBeds),
        availableIcu: Number(availableIcu),
        status, contact: contact || null
      }
    });
    await logActivity('Hospital Updated', 'Hospitals', `Updated hospital ${name}`);
    return res.json(hospital);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await prisma.hospital.delete({ where: { id: req.params.id } });
    await logActivity('Hospital Deleted', 'Hospitals', `Deleted hospital ${hospital.name}`);
    return res.json({ message: 'Hospital deleted successfully' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// =========================================================
// AMBULANCES
// =========================================================
app.get('/api/ambulances', async (req, res) => {
  const { search } = req.query;
  try {
    const ambulances = await prisma.ambulance.findMany({
      where: search ? {
        OR: [
          { vehicleNo: { contains: String(search), mode: 'insensitive' } },
          { location: { contains: String(search), mode: 'insensitive' } },
          { driverName: { contains: String(search), mode: 'insensitive' } },
          { status: { contains: String(search), mode: 'insensitive' } },
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(ambulances);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ambulances', async (req, res) => {
  try {
    const { vehicleNo, type, status, location, driverName, contact, hospital } = req.body;
    if (!vehicleNo) return res.status(400).json({ error: 'Vehicle number is required' });
    const ambulance = await prisma.ambulance.create({
      data: {
        vehicleNo, type: type || 'Basic Life Support',
        status: status || 'Available',
        location: location || 'Base Station',
        driverName: driverName || null,
        contact: contact || null,
        hospital: hospital || null
      }
    });
    await logActivity('Ambulance Registered', 'Ambulances', `Registered ambulance ${vehicleNo}`);
    return res.status(201).json(ambulance);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Vehicle number already exists' });
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/ambulances/:id', async (req, res) => {
  try {
    const { vehicleNo, type, status, location, driverName, contact, hospital } = req.body;
    const ambulance = await prisma.ambulance.update({
      where: { id: req.params.id },
      data: {
        vehicleNo, type, status, location,
        driverName: driverName || null,
        contact: contact || null,
        hospital: hospital || null
      }
    });
    await logActivity('Ambulance Updated', 'Ambulances', `Updated ambulance ${vehicleNo}`);
    return res.json(ambulance);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/ambulances/:id', async (req, res) => {
  try {
    const ambulance = await prisma.ambulance.delete({ where: { id: req.params.id } });
    await logActivity('Ambulance Deleted', 'Ambulances', `Deleted ambulance ${ambulance.vehicleNo}`);
    return res.json({ message: 'Ambulance deleted successfully' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// =========================================================
// ACTIVITY LOGS
// =========================================================
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
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// =========================================================
// START
// =========================================================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
