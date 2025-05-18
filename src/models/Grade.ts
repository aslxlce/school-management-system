import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  _id: Number,
  level: { type: Number, unique: true, required: true }
});

export default mongoose.models.Grade || mongoose.model('Grade', gradeSchema);