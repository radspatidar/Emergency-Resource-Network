import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.trip.deleteMany();
  await prisma.emergencyRequest.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { name: 'System Administrator', email: 'admin@healthresq.in', password: 'admin123', role: 'System Admin', status: 'Active' }
  });

  const hospitalAdmin = await prisma.user.create({
    data: { name: 'Dr. Priya Sharma', email: 'hospital@healthresq.in', password: 'hospital123', role: 'Hospital Admin', status: 'Active' }
  });

  const coordinator = await prisma.user.create({
    data: { name: 'EMS Coordinator', email: 'coordinator@healthresq.in', password: 'coordinator123', role: 'Emergency Coordinator', status: 'Active' }
  });

  const operator = await prisma.user.create({
    data: { name: 'Rahul Sharma', email: 'operator@healthresq.in', password: 'operator123', role: 'Ambulance Operator', status: 'Active' }
  });

  console.log('✅ Users created');

  // ── Hospitals ──────────────────────────────────────────────────────────────
  const h1 = await prisma.hospital.create({
    data: {
      name: 'City Care Hospital', city: 'Indore', type: 'Trauma Center',
      totalBeds: 120, availableBeds: 45, icuBeds: 20, availableIcu: 8,
      ventilators: 15, availableVentilators: 6, oxygenUnits: 50, availableOxygen: 30,
      doctorsAvailable: 12, nursesAvailable: 25, emergencyStatus: 'AVAILABLE', status: 'Active',
      contact: '+91 731 2222111', address: 'MG Road, Indore'
    }
  });

  const h2 = await prisma.hospital.create({
    data: {
      name: 'Apollo Emergency Center', city: 'Indore', type: 'General Hospital',
      totalBeds: 80, availableBeds: 12, icuBeds: 10, availableIcu: 2,
      ventilators: 8, availableVentilators: 1, oxygenUnits: 30, availableOxygen: 10,
      doctorsAvailable: 6, nursesAvailable: 15, emergencyStatus: 'BUSY', status: 'Active',
      contact: '+91 731 3333222', address: 'AB Road, Indore'
    }
  });

  const h3 = await prisma.hospital.create({
    data: {
      name: 'Metro General Hospital', city: 'Bhopal', type: 'General Hospital',
      totalBeds: 200, availableBeds: 90, icuBeds: 30, availableIcu: 15,
      ventilators: 20, availableVentilators: 10, oxygenUnits: 80, availableOxygen: 60,
      doctorsAvailable: 20, nursesAvailable: 40, emergencyStatus: 'AVAILABLE', status: 'Active',
      contact: '+91 755 4444333', address: 'New Market, Bhopal'
    }
  });

  const h4 = await prisma.hospital.create({
    data: {
      name: 'Lifeline Trauma Center', city: 'Indore', type: 'Trauma Center',
      totalBeds: 60, availableBeds: 0, icuBeds: 8, availableIcu: 0,
      ventilators: 5, availableVentilators: 0, oxygenUnits: 20, availableOxygen: 2,
      doctorsAvailable: 2, nursesAvailable: 5, emergencyStatus: 'FULL', status: 'Active',
      contact: '+91 731 5555444', address: 'Rajwada, Indore'
    }
  });

  // Update hospital admin's hospitalId
  await prisma.user.update({ where: { id: hospitalAdmin.id }, data: { hospitalId: h1.id } });

  console.log('✅ Hospitals created');

  // ── Ambulances ─────────────────────────────────────────────────────────────
  const a1 = await prisma.ambulance.create({
    data: {
      vehicleNo: 'A001', type: 'Advanced Life Support', status: 'Available',
      lat: 22.7196, lng: 75.8577, locationLabel: 'Base Station - Indore',
      driverName: 'Rahul Sharma', contact: '+91 9876543210', hospitalId: h1.id
    }
  });

  const a2 = await prisma.ambulance.create({
    data: {
      vehicleNo: 'A002', type: 'Advanced Life Support', status: 'Busy',
      lat: 22.7230, lng: 75.8615, locationLabel: 'En Route',
      driverName: 'Amit Verma', contact: '+91 9876543211', hospitalId: h1.id
    }
  });

  const a3 = await prisma.ambulance.create({
    data: {
      vehicleNo: 'A003', type: 'Basic Life Support', status: 'Available',
      lat: 22.7265, lng: 75.8650, locationLabel: 'Station 2 - Bhopal',
      driverName: 'Suresh Kumar', contact: '+91 9876543212', hospitalId: h2.id
    }
  });

  await prisma.ambulance.create({
    data: {
      vehicleNo: 'A004', type: 'Basic Life Support', status: 'Out of Service',
      lat: 22.7100, lng: 75.8400, locationLabel: 'Maintenance Bay',
      driverName: 'Rajesh Singh', contact: '+91 9876543213'
    }
  });

  // Link operator to ambulance A001
  await prisma.user.update({ where: { id: operator.id }, data: { ambulanceId: a1.id } });

  console.log('✅ Ambulances created');

  // ── Emergency Requests ─────────────────────────────────────────────────────
  const er1 = await prisma.emergencyRequest.create({
    data: {
      requestCode: 'ER-001', patientId: 'P-101', emergencyType: 'Medical Emergency',
      location: '22 MG Road, Indore', priority: 'Critical',
      requiredResources: ['ICU', 'Ventilator', 'Emergency Doctor'],
      status: 'Assigned', createdBy: 'EMS Coordinator',
      hospitalId: h1.id, ambulanceId: a1.id,
      notes: 'Patient has severe breathing difficulty'
    }
  });

  const er2 = await prisma.emergencyRequest.create({
    data: {
      requestCode: 'ER-002', patientId: 'P-102', emergencyType: 'Road Accident',
      location: 'Bypass Road, Indore', priority: 'High',
      requiredResources: ['ICU', 'Emergency Doctor'],
      status: 'In Progress', createdBy: 'EMS Coordinator',
      hospitalId: h2.id, ambulanceId: a2.id
    }
  });

  const er3 = await prisma.emergencyRequest.create({
    data: {
      requestCode: 'ER-003', patientId: 'P-103', emergencyType: 'Cardiac Arrest',
      location: 'Vijay Nagar, Indore', priority: 'Critical',
      requiredResources: ['ICU', 'Ventilator'],
      status: 'Pending', createdBy: 'EMS Coordinator'
    }
  });

  const er4 = await prisma.emergencyRequest.create({
    data: {
      requestCode: 'ER-004', patientId: 'P-104', emergencyType: 'Stroke',
      location: 'Palasia, Indore', priority: 'High',
      requiredResources: ['ICU', 'Emergency Doctor'],
      status: 'Completed', createdBy: 'EMS Coordinator',
      hospitalId: h3.id, ambulanceId: a3.id
    }
  });

  console.log('✅ Emergency requests created');

  // ── Trips ──────────────────────────────────────────────────────────────────
  await prisma.trip.create({
    data: {
      tripCode: 'TRIP-001', emergencyId: er1.id, ambulanceId: a1.id,
      status: 'Not Started', currentLat: 22.7196, currentLng: 75.8577, waypointIndex: 0
    }
  });

  await prisma.trip.create({
    data: {
      tripCode: 'TRIP-002', emergencyId: er2.id, ambulanceId: a2.id,
      status: 'In Progress', currentLat: 22.7230, currentLng: 75.8615, waypointIndex: 2,
      startedAt: new Date(Date.now() - 30 * 60 * 1000)
    }
  });

  await prisma.trip.create({
    data: {
      tripCode: 'TRIP-003', emergencyId: er4.id, ambulanceId: a3.id,
      status: 'Completed', currentLat: 22.7265, currentLng: 75.8650, waypointIndex: 4,
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 60 * 60 * 1000)
    }
  });

  console.log('✅ Trips created');

  // ── Activity Logs ──────────────────────────────────────────────────────────
  const logs = [
    { action: 'User Login', module: 'System', description: 'System Administrator logged in', user: 'System Administrator' },
    { action: 'Hospital Registered', module: 'Hospitals', description: 'Registered hospital City Care Hospital', user: 'System Administrator' },
    { action: 'Ambulance Registered', module: 'Ambulances', description: 'Registered ambulance A001', user: 'System Administrator' },
    { action: 'Emergency Created', module: 'Emergency', description: 'Created emergency ER-001 — Medical Emergency (Critical)', user: 'EMS Coordinator', refId: er1.id },
    { action: 'Assignment Confirmed', module: 'Emergency', description: 'Emergency ER-001 assigned to hospital & ambulance', user: 'EMS Coordinator', refId: er1.id },
    { action: 'Trip Started', module: 'Emergency', description: 'Trip TRIP-002 started', user: 'Ambulance Operator', refId: er2.id },
  ];
  for (const log of logs) {
    await prisma.activityLog.create({ data: log });
  }

  console.log('✅ Activity logs created');
  console.log('🎉 Seed complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
