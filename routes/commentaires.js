const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Récupérer tous les commentaires
router.get('/', async(req, res) => {
  var skip = parseInt(req.query.skip) || 0;
  var take = parseInt(req.query.take) || 10;
  const  articleId=parseInt(req.body.article);
  const article= await prisma.article.findUnique({
    where:{
      id:articleId
    }
  });
  if(article){
    const commentaires=await prisma.commentaire.findMany({
      where:{
        articleId:article.id
      },
      skip:skip,
      take:take
    });
    return res.json(commentaires);
  }
  return res.status(400).json({error:"error handling the request"});
  
});

// Récupérer un commentaire par son ID
router.get('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
 try {
  const commentaire = await prisma.commentaire.findUnique({
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
router.post('/', async (req, res) => {
  try {
    const { contenu, articleId } = req.body;

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        article: {
          connect: { id: articleId },
        },
      },
    });

    res.json(commentaire);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding commentaire' });
  }
});

// Modifier un commentaire existant
router.put('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const commentaire=await prisma.commentaire.findUnique({
    where: {
      id: id
    },
  });
  if(!commentaire)
    return res.status(404).json({ error: "error Handling the request" });
  
  commentaire.contenu=req.body.contenu || commentaire.contenu;
  const newCommentaire=await prisma.commentaire.update({
    where:{
      id:commentaire.id
    },
    data:commentaire
  });
  return res.json(newCommentaire);

});

// Supprimer un commentaire existant
router.delete('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const commentaire= await prisma.commentaire.findUnique({
    where: {
      id: id
    },
  });
  if(commentaire){
    await prisma.commentaire.delete({
      where:{
        id:commentaire.id
      }
    });
    return res.json({message:"commentaire deleted successfuly"});
  }else{
    return res.status(404).json({ error: "error Handling the request" });
  }
  
});

module.exports = router;
