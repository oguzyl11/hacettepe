const { execFileSync } = require("node:child_process");
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.item.count();
    if (count > 0) {
      console.log(`Database already has ${count} items; seed skipped.`);
      return;
    }
    execFileSync("node", ["prisma/seed.cjs"], { stdio: "inherit" });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
