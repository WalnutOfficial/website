import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Define types
interface WaitlistUser {
  name: string;
  email: string;
  yearLevel: string;
  signupDate: Date;
}

interface FormData {
  name: string;
  email: string;
  year: string;
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set static folder based on environment
// In Heroku, the app will be in server/dist so we need to serve from ../../
const staticPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../../')
  : path.join(__dirname, '../../');

app.use(express.static(staticPath));

// MongoDB Connection
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || 'walnut';
const collectionName = process.env.WAITLIST_COLLECTION || 'waitlist';

// Connect to MongoDB
async function connectToMongo(): Promise<Db> {
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
app.post('/api/submit-form', async (req: express.Request, res: express.Response) => {
  try {
    const db = await connectToMongo();
    const collection: Collection<WaitlistUser> = db.collection(collectionName);
    
    // Get form data from request body
    const { name, email, year }: FormData = req.body;
    
    // Validate required fields
    if (!name || !email || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create document with timestamp
    const newUser: WaitlistUser = {
      name,
      email,
      yearLevel: year,
      signupDate: new Date()
    };
    
    // Insert into MongoDB
    const result: InsertOneResult<WaitlistUser> = await collection.insertOne(newUser);
    
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

// For all other GET requests, serve the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 