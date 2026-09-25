const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany();
  console.log('Trips:', trips.length);
  const emergencies = await prisma.emergencyRequest.findMany({ where: { status: 'Assigned' } });
  console.log('Assigned emergencies:', emergencies.map(e => e.requestCode));
}
main().catch(console.error).finally(() => prisma.$disconnect());
