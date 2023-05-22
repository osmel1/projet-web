const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Récupérer toutes les catégories
router.get('/', async (req, res) => {
  var skip = parseInt(req.query.skip) || 0;
  var take = parseInt(req.query.take) || 10;
  const categories = await prisma.category.findMany({
    skip: skip,
    take: take,
        include: {
      articles: true,
    },
  });
  return res.json(categories);
});

// Récupérer une catégorie par son ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const categorie = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!categorie) {
    return res.status(404).json({ error: 'categorie not found' });
  }
  return res.json(categorie);

});

// Ajouter une nouvelle catégorie
router.post('/', async (req, res) => {
  try{
   const categorie=await prisma.category.create({
    data: {
      name: req.body.name,
    },
  });
  return res.json(categorie);
}catch(error){
  return res.status(400).json({ error: 'error add categorie' });
}
});

// Modifier une catégorie existante
router.put('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const categorie=await prisma.category.findUnique({
    where: {
      id: id
    },
  });
  if(!categorie)
    return res.status(404).json({ error: "error Handling the request" });
  
  categorie.name=req.body.name || categorie.name;
  const newCategorie=await prisma.category.update({
    where:{
      id:categorie.id
    },
    data:categorie
  });
  return res.json(newCategorie);
});

// Supprimer une catégorie existante
router.delete('/:id', async(req, res) => {
  
  const id = parseInt(req.params.id);
  const categorie= await prisma.category.findUnique({
    where: {
      id: id
    },
  });
  if(categorie){
    await prisma.categorie.delete({
      where:{
        id:categorie.id
      }
    });
    return res.json({message:"categorie deleted successfuly"});
  }else{
    return res.status(404).json({ error: "error Handling the request" });
  }
  
});

module.exports = router;
