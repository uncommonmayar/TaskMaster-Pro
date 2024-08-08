const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const User = require('./models/User'); // Import the User model

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/taskmaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');

    // Check if the user "Mayar" exists and create it if not
    User.findOne({ username: 'Mayar' }).then((user) => {
      if (!user) {
        const hashedPassword = bcrypt.hashSync('Admin', 10);
        const newUser = new User({
          username: 'Mayar',
          password: hashedPassword,
          role: 'admin', // Assign role as needed
        });

        newUser.save().then(() => {
          console.log('Admin user created with username: Mayar');
        }).catch((err) => {
          console.error('Error creating admin user:', err);
        });
      } else {
        console.log('Admin user already exists.');
      }
    }).catch((err) => {
      console.error('Error checking for existing admin user:', err);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

// Use routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes); // Use task routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
