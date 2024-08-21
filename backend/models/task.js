const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    reminder: String,
    alarmTime: String,
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', taskSchema);
