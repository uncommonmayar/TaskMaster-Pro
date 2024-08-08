const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255 // Example validation rule for maximum length
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes
taskSchema.index({ completed: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual property to calculate task duration
taskSchema.virtual('duration').get(function() {
  if (this.completedAt) {
    return Math.round((this.completedAt - this.createdAt) / (1000 * 60)); // Duration in minutes
  }
  return null;
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
