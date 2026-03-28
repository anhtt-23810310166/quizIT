const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const userEmail = "user@quiz.it";
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("user123", 10);
    await prisma.user.create({
      data: {
        name: "Test User",
        email: userEmail,
        password: hashedPassword,
        role: "USER",
      },
    });
    console.log("User account created: user@quiz.it / user123");
  } else {
    console.log("User account already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
