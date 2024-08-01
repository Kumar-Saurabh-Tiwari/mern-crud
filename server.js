const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

const port = 5000;
app.use(cors());
app.use(bodyParser.json());
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mern-crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
});
const Task = mongoose.model('Task', taskSchema);
// CRUD Routes
// Create Task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});
// Read All Tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});
// Read Single Task
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).send('Task not found');
        } else {
            res.send(task);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
// Update Task
app.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).send('Task not found');
        } else {
            res.send(task);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
// Delete Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send('Task not found');
        } else {
            res.send('Task deleted');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});