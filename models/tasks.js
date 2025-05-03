const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    taskDescription: {
        type:String,
        required: true,
    },
    completed: {
        type:Boolean,
        default:false
    },
    dueDate: {
        type: Date,
        required:true
    },
    createdDate: {
        type:Date,
        required:true,
        default:Date.now
    }
})

module.exports = mongoose.model('tasks',taskSchema)