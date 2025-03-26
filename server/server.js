require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));  // Serve static files from the root directory

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || 'walnut';
const collectionName = process.env.WAITLIST_COLLECTION || 'waitlist';

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// API endpoint to submit form data
app.post('/api/submit-form', async (req, res) => {
  try {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    
    // Get form data from request body
    const { name, email, year } = req.body;
    
    // Validate required fields
    if (!name || !email || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create document with timestamp
    const newUser = {
      name,
      email,
      yearLevel: year,
      signupDate: new Date()
    };
    
    // Insert into MongoDB
    const result = await collection.insertOne(newUser);
    
    if (result.acknowledged) {
      res.status(201).json({ 
        success: true, 
        message: 'User added to waitlist successfully',
        userId: result.insertedId
      });
    } else {
      throw new Error('Failed to insert document');
    }
  } catch (error) {
    console.error('Error submitting to MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing your request' 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 