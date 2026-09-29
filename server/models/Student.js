import mongoose from 'mongoose';

const namePattern = /^[\p{L}][\p{L} .'-]{0,79}$/u;

const studentSchema = new mongoose.Schema({
  admissionNo: {
    type: String,
    required: [true, 'Admission number is required.'],
    trim: true,
    minlength: [1, 'Admission number cannot be empty.'],
    maxlength: [30, 'Admission number cannot exceed 30 characters.'],
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required.'],
    trim: true,
    maxlength: [80, 'Student name cannot exceed 80 characters.'],
    match: [namePattern, 'Enter a valid student name.'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required.'],
    validate: {
      validator: (date) => date < new Date(new Date().toDateString()),
      message: 'Date of birth must be a valid date before today.',
    },
  },
  gender: {
    type: String,
    required: [true, 'Gender is required.'],
    enum: { values: ['Male', 'Female', 'Other'], message: 'Select a valid gender.' },
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required."],
    trim: true,
    maxlength: [80, "Father's name cannot exceed 80 characters."],
    match: [namePattern, "Enter a valid father's name."],
  },
}, { timestamps: true, versionKey: false });

studentSchema.index({ admissionNo: 1 }, { unique: true });

export default mongoose.model('Student', studentSchema);