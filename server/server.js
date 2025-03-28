const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Connect to database
(async () => {
  try {
    await connectDB();
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Auth API running');
});