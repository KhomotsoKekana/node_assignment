require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const taskRouter = require('./routes/TaskRoute')

//var task = [{title:'test',description:'testDescrption'}];

//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('yay connected!'))
    .catch(err  => console.error("Could not connect to the db",err))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/tasks',taskRouter)

app.listen(3000, () => {
    console.log('server running on port 3000....');
});