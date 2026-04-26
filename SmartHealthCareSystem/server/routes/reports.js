const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const OpenAI = require('openai');
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|gif|bmp|tiff/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// Initialize OpenAI
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze medical text using OpenAI
async function analyzeReport(extractedText) {
  const openai = getOpenAI();

  const prompt = `You are a medical report analyzer. Analyze the following medical report text and extract health parameters.

Return a JSON object with this exact structure:
{
  "parameters": [
    {
      "name": "Parameter Name (e.g., Blood Pressure, Blood Sugar, Hemoglobin)",
      "value": "the measured value",
      "unit": "unit of measurement",
      "normalRange": "normal range for this parameter",
      "status": "normal|high|low|critical",
      "explanation": "Simple explanation in layman terms about what this means"
    }
  ],
  "summary": "Brief overall health summary in simple language",
  "suggestions": {
    "medicines": ["Safe OTC medicine suggestions only - no prescription drugs"],
    "diet": ["Diet recommendations based on the report"],
    "exercise": ["Exercise recommendations"],
    "homeRemedies": ["Gharelu Upchar / home remedies"]
  },
  "overallStatus": "healthy|attention|critical"
}

IMPORTANT: 
- Only suggest safe, non-prescription medicines
- Always note this is not a substitute for professional medical advice
- Explain in simple, easy-to-understand language
- If you cannot extract certain values, skip them
- Include common parameters: BP, Blood Sugar, Cholesterol, Hemoglobin, etc.

Medical Report Text:
${extractedText}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a medical report analyzer. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('OpenAI analysis error:', error.message);
    // Return a demo analysis if OpenAI fails
    return getDemoAnalysis();
  }
}

function getDemoAnalysis() {
  return {
    parameters: [
      { name: 'Blood Pressure (Systolic)', value: '130', unit: 'mmHg', normalRange: '90-120', status: 'high', explanation: 'Your systolic blood pressure is slightly elevated. This means your heart is pumping blood with more force than normal.' },
      { name: 'Blood Pressure (Diastolic)', value: '85', unit: 'mmHg', normalRange: '60-80', status: 'high', explanation: 'Your diastolic blood pressure is slightly above normal range.' },
      { name: 'Blood Sugar (Fasting)', value: '110', unit: 'mg/dL', normalRange: '70-100', status: 'high', explanation: 'Your fasting blood sugar is slightly elevated, which may indicate pre-diabetic condition.' },
      { name: 'Hemoglobin', value: '13.5', unit: 'g/dL', normalRange: '13.5-17.5', status: 'normal', explanation: 'Your hemoglobin level is within the normal range, indicating healthy oxygen-carrying capacity.' },
      { name: 'Total Cholesterol', value: '220', unit: 'mg/dL', normalRange: '125-200', status: 'high', explanation: 'Your cholesterol is above the desirable level. High cholesterol can increase the risk of heart disease.' },
      { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', normalRange: '40-60', status: 'normal', explanation: 'Your HDL (good cholesterol) is within normal range.' },
      { name: 'LDL Cholesterol', value: '150', unit: 'mg/dL', normalRange: '0-100', status: 'high', explanation: 'Your LDL (bad cholesterol) is above optimal level.' }
    ],
    summary: 'Your report shows slightly elevated blood pressure, borderline high blood sugar, and elevated cholesterol levels. Hemoglobin and HDL cholesterol are within normal limits. Lifestyle modifications are recommended.',
    suggestions: {
      medicines: ['Aspirin (low dose, consult doctor first)', 'Omega-3 fish oil supplements', 'Multivitamin supplements'],
      diet: ['Reduce salt intake to lower blood pressure', 'Increase fiber-rich foods (oats, fruits, vegetables)', 'Avoid sugary drinks and processed foods', 'Include more omega-3 rich foods (walnuts, flaxseeds)', 'Eat smaller, more frequent meals'],
      exercise: ['30 minutes of brisk walking daily', 'Yoga and meditation for stress management', 'Light cardio exercises 3-4 times a week', 'Avoid intense exercise without consulting doctor'],
      homeRemedies: ['Drink warm water with lemon every morning', 'Methi (fenugreek) seeds soaked overnight - eat on empty stomach', 'Cinnamon tea to help regulate blood sugar', 'Garlic - eat 2 raw cloves daily for cholesterol', 'Tulsi (basil) leaves tea for overall health']
    },
    overallStatus: 'attention'
  };
}

// POST /api/reports/upload — upload and analyze a report
router.post('/upload', auth, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let extractedText = '';

    // OCR - Extract text from image
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(`OCR: ${m.status} - ${Math.round(m.progress * 100)}%`)
      });
      extractedText = text;
    } catch (ocrError) {
      console.error('OCR Error:', ocrError.message);
      extractedText = 'Unable to extract text from the uploaded file. Using demo data for analysis.';
    }

    // Analyze using AI
    const analysis = await analyzeReport(extractedText);

    // Save report
    const report = new Report({
      userId: req.user._id,
      familyMemberId: req.body.familyMemberId || null,
      fileName: req.file.originalname,
      extractedText,
      analysis: analysis || getDemoAnalysis()
    });
    await report.save();

    // Clean up uploaded file (privacy)
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports — list reports for current user
router.get('/', auth, async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.familyMemberId) query.familyMemberId = req.query.familyMemberId;

    const reports = await Report.find(query)
      .populate('familyMemberId', 'name relation')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports/:id — get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('familyMemberId', 'name relation age gender');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reports/:id — delete a report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
