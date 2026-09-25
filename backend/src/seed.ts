import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@healthresq.in' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'admin@healthresq.in',
      password: 'admin123',
      role: 'System Admin',
      status: 'Active',
      phone: '+91 98765 43210',
    },
  });
  console.log('✅ Seeded admin user:', user.name, '|', user.email);

  const hospitalUser = await prisma.user.upsert({
    where: { email: 'hospital@healthresq.in' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'hospital@healthresq.in',
      password: 'hospital123',
      role: 'Hospital Admin',
      status: 'Active',
      phone: '+91 88776 55443',
      hospital: 'City Care Hospital'
    },
  });
  console.log('✅ Seeded hospital admin user:', hospitalUser.name, '|', hospitalUser.email);

  const coordinatorUser = await prisma.user.upsert({
    where: { email: 'coordinator@healthresq.in' },
    update: {},
    create: {
      name: 'EMS Coordinator',
      email: 'coordinator@healthresq.in',
      password: 'coordinator123',
      role: 'Emergency Coordinator',
      status: 'Active',
      phone: '+91 77665 54433',
    },
  });
  console.log('✅ Seeded emergency coordinator user:', coordinatorUser.name, '|', coordinatorUser.email);
  console.log('   Passwords for all are: admin123, hospital123, coordinator123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

