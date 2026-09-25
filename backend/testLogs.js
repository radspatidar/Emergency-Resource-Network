const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const logs = await prisma.activityLog.findMany({ orderBy: { id: 'desc' }, take: 10 });
  console.log(logs.map(l => `${l.action} at ${l.id}`));
}
check().finally(() => prisma.$disconnect());
