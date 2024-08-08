const express = require('express');
const Task = require('../models/Task');
const {authMiddleware, roleMiddleware} = require('./roleMiddleware')
const router = express.Router();
const Joi = require('joi');

// Task validation schema
const taskSchema = Joi.object({
  task: Joi.string().required(),
  completed: Joi.boolean(),
  completedAt: Joi.date(),
});

// Route to create a new task (protected, role-based access)
router.post('/tasks', roleMiddleware, async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const task = new Task({
      ...req.body,
      user: req.user._id, // Associate task with the authenticated user
    });
    await task.save();
    return res.status(201).send(task);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// Route to get all tasks (protected, role-based access, with pagination)
router.get('/tasks', roleMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const tasks = await Task.find({ user: req.user._id }) // Fetch only tasks owned by the authenticated user
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments({ user: req.user._id });

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update a task (protected, role-based access)
router.patch('/tasks/:id', roleMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['task', 'completed', 'completedAt'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    updates.forEach(update => task[update] = req.body[update]);

    // Set completedAt date if task is marked as completed
    if (req.body.completed) {
      task.completedAt = new Date();
    }

    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Route to delete a task (protected, role-based access)
router.delete('/tasks/:id', roleMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
