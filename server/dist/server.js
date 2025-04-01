"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const path = __importStar(require("path"));
// Load environment variables
dotenv.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Set static folder based on environment
// In Heroku, the app will be in server/dist so we need to serve from ../../
const staticPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../')
    : path.join(__dirname, '../../');
app.use(express_1.default.static(staticPath));
// MongoDB Connection
const uri = process.env.MONGODB_URI || '';
const client = new mongodb_1.MongoClient(uri);
const dbName = process.env.DB_NAME || 'walnut';
const collectionName = process.env.WAITLIST_COLLECTION || 'waitlist';
// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    }
    catch (error) {
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
        }
        else {
            throw new Error('Failed to insert document');
        }
    }
    catch (error) {
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
