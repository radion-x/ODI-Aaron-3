import express, { Request, Response, Application } from 'express'; // Import Request, Response, Application directly
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Added for ESM __dirname
import { dirname } from 'path'; // Added for ESM __dirname

// ESM compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Access default export for the express function
const app: Application = express(); // Use Application type directly and remove expressNs.default
const PORT = process.env.PORT || 3001; // Backend server port

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

const DATA_FILE_PATH = path.join(__dirname, 'assessments_data.json');

// Ensure the data file exists
const initializeDataFile = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]), 'utf8');
  }
};

initializeDataFile();

interface UserDetails {
  name: string;
  email: string;
}

interface AssessmentPayload {
  userDetails: UserDetails;
  assessmentData: any; // Consider defining a more specific type for assessmentData
}

// API Endpoint to save assessment data
app.post('/api/save-assessment', (req: Request, res: Response) => { // Simplified req type for now
  try {
    const newRecord = req.body as AssessmentPayload; // Add type assertion for req.body

    if (!newRecord || !newRecord.userDetails || !newRecord.assessmentData) {
      return res.status(400).json({ message: 'Invalid data format.' });
    }

    // Read existing data
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const allRecords = JSON.parse(fileContent);

    // Add new record
    allRecords.push({ ...newRecord, receivedAt: new Date().toISOString() });

    // Write updated data back to file
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(allRecords, null, 2), 'utf8');

    console.log('Data saved successfully:', newRecord.userDetails.email);
    res.status(201).json({ message: 'Assessment data saved successfully.' });
  } catch (error) {
    console.error('Error saving assessment data:', error);
    res.status(500).json({ message: 'Failed to save assessment data.' });
  }
});

// API Endpoint to get all assessment data (optional, for verification)
app.get('/api/get-assessments', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return res.status(200).json([]);
    }
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const allRecords = JSON.parse(fileContent);
    res.status(200).json(allRecords);
  } catch (error) {
    console.error('Error retrieving assessment data:', error);
    res.status(500).json({ message: 'Failed to retrieve assessment data.' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
