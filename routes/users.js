const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(express.json())

router.get('/', async (req, res) => {
    const { take, skip } = req.query;
    const users=await prisma.user.findMany(
        {
            take: parseInt(take, 10) || undefined,
            skip: parseInt(skip, 10) || undefined,
        }
    );
    res.status(200).json(users);
})
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id:parseInt(id),
            },
        });
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404).json({message:'User not found'});
    }
})

router.put('/:id',async (req,res)=>{
    const { id } = req.params;
    await prisma.user
    .update(
        {
            where: {
                id:parseInt(id),
                },
            data: req.body
        }
    )
    .then(
        (article)=>res.json(article)
    ).catch(err=>res.status(404).json({message : err}))
})

router.delete('/:id',async (req,res)=>{
    const { id } = req.params;
    await prisma.user
    .delete(
        {
            where: {
                id:parseInt(id),
                },
        })
    .catch(err=>res.status(404).json({message : err}))
})
router.post('/users', async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).send('Name, email, password, and role are required');
    }

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    const createdUser = await prisma.user.create({
      data: newUser,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});
module.exports=router