const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const elif = await prisma.user.upsert({
    where: { email: "elif.yilmaz@hacettepe.edu.tr" },
    update: { name: "Elif Yılmaz", preferredContact: "EMAIL" },
    create: {
      name: "Elif Yılmaz",
      email: "elif.yilmaz@hacettepe.edu.tr",
      preferredContact: "EMAIL",
    },
  });

  const kerem = await prisma.user.upsert({
    where: { email: "kerem.aydin@hacettepe.edu.tr" },
    update: {
      name: "Kerem Aydın",
      instagramHandle: "kerem.aydin",
      preferredContact: "INSTAGRAM",
    },
    create: {
      name: "Kerem Aydın",
      email: "kerem.aydin@hacettepe.edu.tr",
      instagramHandle: "kerem.aydin",
      preferredContact: "INSTAGRAM",
    },
  });

  await prisma.item.upsert({
    where: { id: "seed-kalkulus" },
    update: {},
    create: {
      id: "seed-kalkulus",
      title: "Thomas Calculus, 14. baskı",
      description:
        "Kenar notları kurşun kalemle. Karşılığında lineer cebir kitabı arıyorum.",
      category: "KITAP",
      condition: "AZ_KULLANILMIS",
      ownerId: elif.id,
    },
  });

  await prisma.item.upsert({
    where: { id: "seed-klavye" },
    update: {},
    create: {
      id: "seed-klavye",
      title: "Mekanik klavye, kırmızı switch",
      description: "Tüm tuşlar çalışıyor. Kulaklık veya mouse ile takas olur.",
      category: "ELEKTRONIK",
      condition: "ORTA_KULLANILMIS",
      ownerId: kerem.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
