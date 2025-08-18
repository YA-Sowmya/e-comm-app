const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@cherry.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@cherry.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin created or already exists:", admin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

createAdmin();
