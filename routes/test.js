const express = require('express');
const router=express.Router();
const {faker} = require('@faker-js/faker');
// or, if desiring a different locale
// import { fakerDE as faker } from '@faker-js/faker';

// router.get('/', async (req, res) => {
//   try {
//         const users =[];
//     for (let i = 0; i <10; i++) {
//         users.push({
//        name: faker.fr.person.first_Name[i],
//         email: faker.fr.internet.example_email[i],
//         password: faker.fr.phone_number[i],
//         role: "ADMIN"});
//     } 
//     res.send(await users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });
  const categoriesIds = []
    const randomCategoriesCount = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < randomCategoriesCount; j++) {
      const randomCategoryId = Math.floor(Math.random() * 10)
      categoriesIds.push({ id: randomCategoryId})
    }
  console.log(categoriesIds)