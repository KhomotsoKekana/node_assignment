const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const jwt = require('jsonwebtoken');

router.use(authenticateToken)

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    taskDescription: req.body.taskDescription,
    dueDate:req.body.dueDate,
    completed:req.body.completed
  })
  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.patch('/:id', getTasks, async (req, res) => {
  if (req.body.completed != null) {
    res.task.completed = req.body.completed
  }
  try {
    const updatedTask = await res.task.save()
    res.json(updatedTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', getTasks, async (req, res) => {
    if (req.body.name != null) {
      res.task.name = req.body.name;
    }
    if (req.body.taskDescription != null) {
      res.task.taskDescription = req.body.taskDescription;
    }
    if (req.body.dueDate != null) {
      res.task.dueDate = new Date(req.body.dueDate)
    }
  
    try {
      const updatedTask = await res.task.save();
      res.json( {message: 'updated task',
       updatedTask: updatedTask});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

router.delete('/:id', getTasks, async (req, res) => {
  try {
    await res.task.deleteOne()
    res.json({ message: 'Task deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


  router.get('/summary', async (req, res) => {
    try {
      const tasks = await Task.find({}, 'name');
      const titles = tasks.map(task => task.name);
      res.json({ total: tasks.length, titles });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/search', async (req, res) => {
    try {
      const q = req.query.q;
      if (!q) {
        return res.status(400).json({ message: 'Enter a query parameter (q)' });
      }
  
      const searchRegex = new RegExp(q, 'i');
  
      const filter = {
        $or: [
          { name: { $regex: searchRegex } },
          { taskDescription: { $regex: searchRegex } }
        ]
      };
  
      const tasks = await Task.find(filter);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.get('/:id', getTasks, (req, res) => {
    res.json(res.task)
  })
  

// middleware
async function getTasks(req, res, next) {
  let task
  try {
    task = await Task.findById(req.params.id)
    if (task == null) {
      return res.status(404).json({ message: 'Cannot find task' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.task = task
  next()
}

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

module.exports = router