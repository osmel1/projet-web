const express= require('express');
const router= express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Import required modules
const bodyParser = require('body-parser');
router.use(express.json());

// Define route for adding a new article
router.post('/', async (req, res) => {
  try {
     if (!req.body) {
      return res.status(400).send('body is required');
    }

    // Create new article object from request body
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.author,
      image: req.body.image_url,

    };

    // Save new article to database using Prisma client
    const createdArticle = await prisma.article.create({
      data: newArticle,
    });

    // Send success response with created article data
    res.status(201).json(createdArticle);
  } catch (err) {
    console.error(err);
    // Send error response
    res.status(500).send('Error adding article');
  }
});
// GET /articles route
router.get('/', async (req, res) => {
  const { take, skip } = req.query;
  const articles = await prisma.article.findMany({
    take: parseInt(take, 10) || undefined,
    skip: parseInt(skip, 10) || undefined,
  });
  res.json(articles);
});
//get /articles/:id route
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const article = await prisma.article.findUnique(
    {
      where: { id },
    })
    if(article){
      res.json(article);
    }else{
      res.status(404).json({message: 'Article not found'});
    }}
  )

module.exports = router;    