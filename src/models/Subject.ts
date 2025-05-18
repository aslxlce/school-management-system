import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, unique: true, required: true }
});

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);