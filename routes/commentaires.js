const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { error } = require('jquery');
const prisma = new PrismaClient();
router.use(express.json())
router.get('/', async (req, res) => {
  const articleId = parseInt(req.query.article);
  
  if (isNaN(articleId)) {
    return res.status(400).json({ error: 'Invalid article ID' });
  }

  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (article) {
    const commentaires = await prisma.comment.findMany({
      where: {
        articleId: article.id,
      },
      skip: parseInt(req.query.skip) || 0,
      take: parseInt(req.query.take) || 10,
    });

    return res.json(commentaires);
  }

  return res.status(400).json({ error: 'Article not found' });
});
// Récupérer un commentaire par son ID
router.get('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
 try {
  const commentaire = await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });
  return res.json(commentaire);
} catch (err) {
  return res.status(404).json({ error: err });
}
});

// Ajouter un nouveau commentaire
router.post('/',async (req, res) => {
  try {
    const { contenu} = req.body;
    const articleId = parseInt(req.body.articleId);
    const article = await prisma.article.findUnique({
      where: {
        id: articleId ,
      },
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const email =req.session.userEmail||req.body.email;
    console.log('email : ',email)
    if(email&&articleId&&contenu){
    const commentaire = await prisma.comment.create({
      data: {
        content:contenu,
        email:email,
        article: {
          connect: { id: articleId , },
        },
      },
    });

    res.json(commentaire);}
    else{
      res.status(404).json({error:'you missed data '});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding commentaire' });
  }
});

// Modifier un commentaire existant
router.put('/:id', checkAuthenticated,async(req, res) => {
  const id = parseInt(req.params.id);
  const commentaire=await prisma.comment.findUnique({
    where: {
      id: id
    },
  });
  if(!commentaire)
    return res.status(404).json({ error: "error Handling the request" });
  
  commentaire.contenu=req.body.contenu || commentaire.contenu;
  const newCommentaire=await prisma.comment.update({
    where:{
      id:commentaire.id
    },
    data:commentaire
  });
  return res.json(newCommentaire);

});

// Supprimer un commentaire existant
router.delete('/:id', checkAuthenticated,async(req, res) => {
  const id = parseInt(req.params.id);
  const commentaire= await prisma.comment.findUnique({
    where: {
      id: id
    },
  });
  if(commentaire){
    await prisma.comment.delete({
      where:{
        id:commentaire.id
      }
    });
    return res.json({message:"commentaire deleted successfuly"});
  }else{
    return res.status(404).json({ error: "error Handling the request" });
  }
  
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  console.log('Sorry , You\'re Not Authenticated' );
}

module.exports = router;
