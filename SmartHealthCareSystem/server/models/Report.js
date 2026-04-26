const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familyMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null
  },
  fileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  analysis: {
    parameters: [{
      name: String,
      value: String,
      unit: String,
      normalRange: String,
      status: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical']
      },
      explanation: String
    }],
    summary: String,
    suggestions: {
      medicines: [String],
      diet: [String],
      exercise: [String],
      homeRemedies: [String]
    },
    overallStatus: {
      type: String,
      enum: ['healthy', 'attention', 'critical'],
      default: 'healthy'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
