const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const test= require('./routes/test')
app.get('/', async (req, res) => {
  const result = await prisma.user.count()
  res.json(result)
})
app.use('/test',test);
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
