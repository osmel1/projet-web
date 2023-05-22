const { PrismaClient } = require('@prisma/client');
const {faker}  = require('@faker-js/faker/locale/en');
const { format } = require('date-fns');
const bcrypt= require('bcrypt')
const prisma = new PrismaClient();

async function main() {
  // Delete all existing data

  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = [];
  for (let i = 0; i < 10; ++i) {
    categories.push({
      id: i,
      name: faker.commerce.department(),
    });
  }
  await prisma.category.createMany({
    data: categories,
  });

  // Create users
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      id: i,
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: await bcrypt.hash(faker.string.alpha(10), 10),
      role: 'AUTHOR',
    });
  }
  users.push({
    id: 10,
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: await bcrypt.hash('password', 10),
    role: 'ADMIN',
  });
  await prisma.user.createMany({
    data: users,
  });

  // Create articles and comments
  const articles = [];
  for (let i = 0; i < 100; i++) {
    const categoriesIds = [];
    const randomCategoriesCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < randomCategoriesCount; j++) {
      const randomCategoryId = Math.floor(Math.random() * 9) + 1;
      categoriesIds.push({ id: randomCategoryId });
    }

    const randomUserId = Math.floor(Math.random() * 9) + 1;
    const article = await prisma.article.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        image: faker.image.url(),
        published: faker.datatype.boolean(),
        author: {
          connect: { id: randomUserId },
        },
        categories: {
          connect: categoriesIds,
        },
      },
    });
    articles.push(article);

    const randomCommentsCount = Math.floor(Math.random() * 21);
    for (let k = 0; k < randomCommentsCount; k++) {
      const randomArticleId = Math.floor(Math.random() * articles.length);
      await prisma.comment.create({
        data: {
          email: faker.internet.email(),
          content: faker.lorem.sentence(),
          article: {
            connect: { id: articles[randomArticleId].id },
          },
        },
      });
    }
  }

  console.log('Seed data added successfully.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
