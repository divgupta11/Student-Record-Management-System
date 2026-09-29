import mongoose from 'mongoose';
import Student from '../models/Student.js';

const studentFields = ['admissionNo', 'studentName', 'dob', 'gender', 'fatherName'];

function readStudentFields(body) {
  return Object.fromEntries(studentFields.map((field) => [field, body[field]]));
}

function invalidId(id) {
  return !mongoose.isValidObjectId(id);
}

export async function listStudents(_request, response) {
  const students = await Student.find().sort({ createdAt: -1 });
  response.status(200).json({ success: true, message: 'Student records loaded.', data: students });
}

export async function getStudent(request, response) {
  if (invalidId(request.params.id)) {
    return response.status(400).json({ success: false, message: 'Invalid student ID.' });
  }
  const student = await Student.findById(request.params.id);
  if (!student) return response.status(404).json({ success: false, message: 'Student not found.' });
  return response.status(200).json({ success: true, message: 'Student record loaded.', data: student });
}

export async function createStudent(request, response) {
  const student = await Student.create(readStudentFields(request.body));
  return response.status(201).json({ success: true, message: 'Student added successfully.', data: student });
}

export async function updateStudent(request, response) {
  if (invalidId(request.params.id)) {
    return response.status(400).json({ success: false, message: 'Invalid student ID.' });
  }
  const student = await Student.findByIdAndUpdate(
    request.params.id,
    readStudentFields(request.body),
    { new: true, runValidators: true, context: 'query' },
  );
  if (!student) return response.status(404).json({ success: false, message: 'Student not found.' });
  return response.status(200).json({ success: true, message: 'Student updated successfully.', data: student });
}

export async function deleteStudent(request, response) {
  if (invalidId(request.params.id)) {
    return response.status(400).json({ success: false, message: 'Invalid student ID.' });
  }
  const student = await Student.findByIdAndDelete(request.params.id);
  if (!student) return response.status(404).json({ success: false, message: 'Student not found.' });
  return response.status(200).json({ success: true, message: 'Student deleted successfully.', data: student });
}