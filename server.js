require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const taskRouter = require('./routes/TaskRoute')

var task = [{title:'test',description:'testDescrption'}];

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('yay connected!'))
    .catch(err  => console.error("Could not connect to the db",err))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/tasks',taskRouter)

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
  })
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

app.listen(3000, () => {
    console.log('server running on port 3000....');
});