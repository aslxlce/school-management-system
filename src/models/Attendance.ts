import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  _id: Number,
  date: { type: Date, required: true },
  present: { type: Boolean, required: true },
  studentId: { type: String, ref: 'Student', required: true },
  lessonId: { type: Number, ref: 'Lesson', required: true }
});

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);