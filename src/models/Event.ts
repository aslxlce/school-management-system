import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  classId: { type: Number, ref: 'Class' }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);