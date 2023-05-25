const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Import required modules
const bodyParser = require('body-parser');
router.use(express.json());

// Define route for adding a new article
router.post('/', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send('Body is required');
    }

    const newArticle = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image_url,
      author: {
        connect: { id: parseInt(req.body.author) }
      }
    };

    const createdArticle = await prisma.article.create({
      data: newArticle,
    });

    res.status(201).json(createdArticle);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding article');
  }
});

// GET /articles route
router.get('/', async (req, res) => {
  const { take, skip } = req.query;
  const articles = await prisma.article.findMany({
    take: parseInt(take, 10) || undefined,
    skip: parseInt(skip, 10) || undefined,
    include: {
      categories: true,
      comments:true,
    },
  });
  res.json(articles);
});
//get /articles/:id route
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const article = await prisma.article.findUnique(
    {
      where: { id },
      include: {
      comments:true,
    },
    })
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
}
)

//  update an existing article
router.put('/:id', async (req, res) => {
  const article = req.body
  await prisma.article
    .update({
      where: {
        id: Number(article.id),
      },
      data: {
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl,
        published: article.published,
        authorName: article.authorName,
        categoryName: article.categoryName,
        updatedAt: new Date(),
      },
    })
    .then((article) => {
      res.status(200).json(article)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})



// suprimmer un article qui a l'id : 
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const articleId = parseInt(id);

  // Delete comments associated with the article
  await prisma.comment.deleteMany({
    where: {
      articleId: articleId
    }
  });

  // Delete the article
  await prisma.article.delete({
    where: {
      id: articleId
    }
  });

  return res.json({ message: "Article and associated comments deleted successfully" });
});
module.exports = router;    