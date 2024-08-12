const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  });

  questionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
  

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports=QuestionModel;