const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

app.get('/', async (req, res) => {
  const result = await prisma.utilisateur.count()
  res.json(result)
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
