import express from 'express'; // Import Request, Response, Application directly
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Added for ESM __dirname
import { dirname } from 'path'; // Added for ESM __dirname
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';

// ESM compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
// Path is relative to the dist/server.js file after compilation
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_SERVER,
  port: parseInt(process.env.MAILGUN_SMTP_PORT || "587", 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});

// Email sending helper function
async function sendEmailNotification(to: string, subject: string, html: string) {
  const mailOptions = {
    from: `"Assessment Admin" <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Helper to format admin email
function formatAdminEmailHTML(userDetails: UserDetails, assessmentData: any, aiInterpretation: string): string {
  let responsesHTML = '';
  if (assessmentData.responses && Array.isArray(assessmentData.responses) && assessmentData.responses.length > 0) {
    responsesHTML += '<h3 style="color: #2c3e50; font-size: 18px; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Individual Responses:</h3>';
    responsesHTML += '<table style="width: 100%; border-collapse: collapse; font-size: 14px;"><thead><tr><th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">Question ID</th><th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">Value</th><th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">Score</th></tr></thead><tbody>';
    assessmentData.responses.forEach((resp: any, index: number) => {
      responsesHTML += `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${resp.questionId || `Q${index + 1}`}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${resp.value}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${resp.score}</td>
      </tr>`;
    });
    responsesHTML += '</tbody></table>';
  }

  return `
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 30px 40px; border-bottom: 1px solid #e0e0e0;">
        <h1 style="color: #34495e; font-size: 24px; margin: 0; text-align: center;">New Assessment Submission</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px;">
        <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0; margin-bottom: 15px;">User Details</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 5px 0;"><strong>Name:</strong> ${userDetails.name}</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 5px 0;"><strong>Email:</strong> ${userDetails.email}</p>

        <h2 style="color: #2c3e50; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">Assessment Summary</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 5px 0;"><strong>Total Score:</strong> ${assessmentData.totalScore} / ${assessmentData.maxScore}</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 5px 0;"><strong>Severity Level:</strong> ${assessmentData.severityLevel}</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 5px 0;"><strong>Completed At:</strong> ${new Date(assessmentData.completedAt).toLocaleString()}</p>
        
        ${responsesHTML}

        <h2 style="color: #2c3e50; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">AI Observations</h2>
        <div style="background-color: #f8f9fa; border-left: 4px solid #7f8c8d; padding: 15px; margin-top: 10px; border-radius: 4px;">
          <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0;">${aiInterpretation.replace(/\n/g, '<br>')}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0;">
        <p style="margin:0;">This is an automated notification.</p>
      </td>
    </tr>
  </table>
</body>
  `;
}

// Helper to format user email
function formatUserEmailHTML(userDetails: UserDetails, assessmentData: any, aiInterpretation: string): string {
  return `
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 30px 40px; border-bottom: 1px solid #e0e0e0; background-color: #2c3e50; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0; text-align: center;">Your Assessment Summary</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello ${userDetails.name},</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thank you for completing the Modified Oswestry Disability Index. Here is a summary of your results:</p>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Assessment Results</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 8px 0;"><strong>Total Score:</strong> ${assessmentData.totalScore} / ${assessmentData.maxScore}</p>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 8px 0;"><strong>Severity Level:</strong> ${assessmentData.severityLevel}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0; margin-bottom: 15px;">AI Observations</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0;">${aiInterpretation.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 30px;">If you have any questions or wish to discuss your results further, please do not hesitate to contact our clinic.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px; text-align: center; font-size: 14px; color: #555; border-top: 1px solid #e0e0e0; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="margin: 5px 0;"><strong>Head Office:</strong> Melbourne Orthopaedic Group, 33 The Avenue, Windsor VIC 3181</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:Admin.Buckland@mog.com.au" style="color: #1abc9c; text-decoration: none;">Admin.Buckland@mog.com.au</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> +61 3 9573 9691</p>
        <p style="margin: 15px 0 5px;">
          <a href="https://aaronbuckland.com" target="_blank" style="color: #1abc9c; text-decoration: none; font-weight: bold;">Visit aaronbuckland.com</a>
        </p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">This email was sent from an automated system. Please do not reply directly.</p>
      </td>
    </tr>
  </table>
</body>
  `;
}


// Access default export for the express function
const app: express.Application = express(); // Use Application type directly and remove expressNs.default
const PORT = process.env.PORT || 3001; // Backend server port

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Correctly point to assessments_data.json in the server/ folder, not server/dist/
const DATA_FILE_PATH = path.resolve(__dirname, '../assessments_data.json');

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

// Combined AssessmentPayload for interpret and admin email
interface FullAssessmentPayloadForInterpretation {
  userDetails: UserDetails;
  assessmentData: { // This should align with FunctionalIndexData from frontend
    branchId: string;
    responses: Array<{ questionId: string; value: string | number; score: number }>;
    totalScore: number;
    maxScore: number;
    severityLevel: string;
    completedAt: Date | string; // Allow string for data from client
  };
}

interface EmailToUserPayload {
  userDetails: UserDetails;
  assessmentData: { // Summary data is fine here
    totalScore: number;
    maxScore: number;
    severityLevel: string;
  };
  aiInterpretation: string;
}


interface AssessmentPayload {
  userDetails: UserDetails;
  assessmentData: any; // Consider defining a more specific type for assessmentData
}

// API Endpoint to get AI interpretation AND send admin email
app.post('/api/interpret-assessment', async (req: express.Request, res: express.Response) => {
  try {
    const { userDetails, assessmentData } = req.body as FullAssessmentPayloadForInterpretation;

    if (!userDetails || !assessmentData || assessmentData.totalScore === undefined || assessmentData.maxScore === undefined || !assessmentData.severityLevel) {
      return res.status(400).json({ message: 'Missing required user or assessment data for interpretation.' });
    }
    const { totalScore, maxScore, severityLevel } = assessmentData;

    const prompt = `
The following is a summary of a Modified Oswestry Disability Index for back pain:
- Total Score: ${totalScore}
- Maximum Possible Score: ${maxScore}
- Calculated Severity Level: ${severityLevel}

Based on this information, provide a brief, neutral observation about the reported impact on the individual's daily life. Focus on what the score and severity generally indicate in terms of functional limitation. Do not provide medical advice, recommendations, or prognoses. Do not suggest specific exercises or treatments. Keep the tone objective and observational. For example, if the severity is "severe", an observation might be "The score suggests that back pain is having a significant impact on the individual's ability to perform daily activities." If the severity is "mild", an observation might be "The score suggests that back pain is causing a low level of disruption to daily activities."
`;

    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Or your preferred model
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    // Assuming the response structure gives text directly in a content block
    // Adjust based on actual Claude SDK response structure if different
    let interpretation = "Could not retrieve interpretation at this time.";
    if (msg.content && msg.content.length > 0 && msg.content[0].type === 'text') {
        interpretation = msg.content[0].text;
    }

    // Send admin email notification
    if (process.env.EMAIL_RECIPIENT_ADDRESS) {
      const adminEmailSubject = `Modified Oswestry Disability Index Summary: ${userDetails.name} - Score: ${totalScore}/${maxScore}`;
      const adminEmailHtml = formatAdminEmailHTML(userDetails, assessmentData, interpretation);
      await sendEmailNotification(process.env.EMAIL_RECIPIENT_ADDRESS, adminEmailSubject, adminEmailHtml);
    } else {
      console.warn('Admin recipient address not configured. Skipping admin email.');
    }
    
    res.status(200).json({ interpretation });

  } catch (error) {
    console.error('Error in AI interpretation or admin email process:', error);
    res.status(500).json({ message: 'Failed to get AI interpretation.' });
  }
});

// API Endpoint to send results to user
app.post('/api/email-results-to-user', async (req: express.Request, res: express.Response) => {
  console.log('Received request for /api/email-results-to-user');
  try {
    const { userDetails, assessmentData, aiInterpretation } = req.body as EmailToUserPayload;
    console.log('Payload for user email:', { userDetails, assessmentData, aiInterpretation });

    if (!userDetails || !userDetails.email || !assessmentData || !aiInterpretation) {
      console.error('Validation failed for user email payload:', { userDetails, assessmentData, aiInterpretation });
      return res.status(400).json({ message: 'Missing required data for sending email to user.' });
    }

    const userEmailSubject = 'Your Modified Oswestry Disability Index Summary';
    const userEmailHtml = formatUserEmailHTML(userDetails, assessmentData, aiInterpretation);
    
    console.log(`Attempting to send email to user: ${userDetails.email}`);
    const emailSent = await sendEmailNotification(userDetails.email, userEmailSubject, userEmailHtml);

    if (emailSent) {
      console.log(`Successfully initiated email to ${userDetails.email}`);
      res.status(200).json({ message: 'Results emailed to user successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to email results to user.' });
    }

  } catch (error) {
    console.error('Error sending email to user:', error);
    res.status(500).json({ message: 'Failed to email results to user.' });
  }
});


// API Endpoint to save assessment data
app.post('/api/save-assessment', (req: express.Request, res: express.Response) => { // Simplified req type for now
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
app.get('/api/get-assessments', (req: express.Request, res: express.Response) => {
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
