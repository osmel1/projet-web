
// //   const {PrismaClient} = require('@prisma/client')
// // const {faker} = require('@faker-js/faker');

// // const prisma = new PrismaClient({ log: ['query'] })


// // // async function main() {
// // //   await prisma.user.deleteMany(); // Delete all existing users

// // //   for (let i = 0; i < 10; i++) {
// // //     const user = await prisma.user.create({
// // //       data: {
// // //         name: faker.fr.person.firstName,
// // //         email: faker.fr.internet.email,
// // //         password: faker.fr.internet.password,
// // //         role: "ADMIN",
// // //         articles:[]
// // //       },
// // //     });

// // //     console.log(`Created user with ID: ${user.id}`);
// // //   }
// // // }





// // async function main() {
// //     await prisma.user.deleteMany(); // Delete all existing users
// //     let admin=[];
// //   let users,articles,categories,commentaires;
// //   users=articles=categories=commentaires=[];
// //   for (let i = 0; i < 10; i++) {
// //     users.push({
// //        name: faker.person.firstName(),
// //         email: faker.internet.email(),  
// //         password: faker.string.alphanumeric(),
// //         role: "AUTHOR"
// //     })
// //   }
// // users.push({
// //   name: faker.person.firstName(),
// //         email: faker.internet.email(),  
// //         password: faker.string.alphanumeric(),
// //         role: "ADMIN"
// // })
// //   await Promise.all(
// //     users.map(async (user) => {
// //       await prisma.user.create({
// //         data: user,
// //       })
// //     })
// //   )
// // }

// // main()
// //   .then(async () => {
// //     await prisma.$disconnect()
// //   })
// //   .catch(async (e) => {
// //     console.error(e)
// //     await prisma.$disconnect()
// //     process.exit(1)
// //   })


// const { PrismaClient } = require('@prisma/client')
// const { faker } = require('@faker-js/faker')
// const { format } = require('date-fns');

// const prisma = new PrismaClient()

// async function main() {
//   //supprimer tout les valeurs precedents 
//   await prisma.user.deleteMany()
//   await prisma.article.deleteMany()
//   await prisma.comment.deleteMany()
//   await prisma.category.deleteMany()

//   const categories = []
//   for (let i = 0; i < 10; i++) {
//     categories.push({
//       id: i,
//       name: faker.commerce.department(),
//     })
//   }

//   const users = []
//   for (let i = 0; i < 10; i++) {
//     users.push({
//       id:i,
//       name: faker.person.firstName(),
//       email: faker.internet.email(),
//       password: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
//       role: 'AUTHOR',
//     })
//   }

//   users.push({
//     name: faker.person.firstName(),
//     email: faker.internet.email(),
//     password: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
//     role: 'ADMIN',
//   })

//     await Promise.all(
//     users.map(async (user) => {
//       await prisma.user.create({
//         data: user,
//       })
//     })
//   )
// /*
//   const articles = []
//   for (let i = 0; i < 100; i++) {
//     const categoriesIds = []
//     const randomCategoriesCount = Math.floor(Math.random() * 4) + 1

//     for (let j = 0; j < randomCategoriesCount; j++) {
//       const randomCategoryId = Math.floor(Math.random() * 10)
//       categoriesIds.push({ id: categories[randomCategoryId].id })
//     }

//     const randomUserId = Math.floor(Math.random() * 11)

//     const article = await prisma.article.create({
//       data: {
//         title: faker.lorem.sentence(),
//         content: faker.lorem.paragraph(),
//         image: faker.image.url(),
//         published: faker.helpers.arrayElement[true,false],
//         author: {
//           connect: { id: users[randomUserId].id },
//         },
//         categories: {
//           connect: categoriesIds,
//         },
//       },
//     })

//     articles.push(article)

//     const randomCommentsCount = Math.floor(Math.random() * 21)

//     for (let k = 0; k < randomCommentsCount; k++) {
//       const randomArticleId = Math.floor(Math.random() * articles.length)

//       await prisma.comment.create({
//         data: {
//           email: faker.internet.email(),
//           content: faker.lorem.sentence(),
//           article: {
//             connect: { id: articles[randomArticleId].id },
//           },
//         },
//       })
//     }
//   }

//   await prisma.category.createMany({
//     data: categories,
//   })


//   console.log('Seed data added successfully.')
//   */
// }
// main()
//   .catch((e) => {
//     console.error(e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')
const { format } = require('date-fns')

const prisma = new PrismaClient()

async function main() {
  // Delete all existing data

  // await prisma.article.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.category.deleteMany()
  // Create categories
  const categories = []
  for (let i = 0; i < 10; ++i) {
    categories.push({
      id: i,
      name: faker.commerce.department(),
    })
  }
  await prisma.category.createMany({
    data: categories,
  })

  // Create users
  const users = []
  for (let i = 0; i < 10; i++) {
    users.push({
      id:i,
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
      role: 'AUTHOR',
    })
  }
  users.push({
        id:10,
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
    role: 'ADMIN',
  })
prisma.user.createMany({
  data:users
})
  // Create articles and comments
  const articles = []
  for (let i = 0; i < 100; i++) {
    const categoriesIds = []
    const randomCategoriesCount = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < randomCategoriesCount; j++) {
      const randomCategoryId = Math.floor(Math.random() * 9)+1
      categoriesIds.push({ id: randomCategoryId})
    }

    const randomUserId = Math.floor(Math.random() * 9)+1
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
    })
    articles.push(article)

    const randomCommentsCount = Math.floor(Math.random() * 21)
    for (let k = 0; k < randomCommentsCount; k++) {
      const randomArticleId = Math.floor(Math.random() * articles.length)
      await prisma.comment.create({
        data: {
          email: faker.internet.email(),
          content: faker.lorem.sentence(),
          article: {
            connect: { id: articles[randomArticleId].id },
          },
        },
      })
    }
  }

  console.log('Seed data added successfully.')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
