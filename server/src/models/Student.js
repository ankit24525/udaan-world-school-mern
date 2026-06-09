import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  photo: String,

  className: String,
  section: String,
  rollNumber: String,
  status: String,
  studentId: String,
  admissionNo: String,

  // OVERVIEW
  dob: String,
  gender: String,
  bloodGroup: String,
  religion: String,
  nationality: String,

  // ACADEMIC
  subjects: [
    {
      name: String,
      teacher: String,
      marks: String,
      grade: String,
    },
  ],
  overallPercentage: String,
  percentage: String,
  grade: String,
  rank: String,
  attendancePercent: String,
  academicYear: String,
  house: String,
  attendance: {
    present: Number,
    absent: Number,
    late: Number,
    percentage: String,
    workingDays: String,
    leaves: String,
    lastPresentDate: String,
    remarks: String,
  },

  // FEES
  totalFee: Number,
  paidAmount: Number,
  pendingAmount: Number,
  nextDueDate: String,
  fees: {
    total: String,
    paid: String,
    due: String,
    lastPayment: String,
  },
  payments: [
    {
      date: String,
      amount: Number,
      mode: String,
      receipt: String,
      title: String,
    },
  ],

  // GUARDIAN
  father: {
    name: String,
    occupation: String,
    phone: String,
    email: String,
  },
  mother: {
    name: String,
    occupation: String,
    phone: String,
    email: String,
  },
  guardian: {
    name: String,
    relation: String,
    phone: String,
    address: String,
  },

  // MEDICAL
  medical: {
    height: String,
    weight: String,
    bloodGroup: String,
    allergies: String,
    medications: String,
    conditions: String,
    doctor: String,
    lastCheckup: String,
    vaccinations: String,
    emergencyName: String,
    emergencyPhone: String,
    hospital: String,
  },

  // ACTIVITIES
  activities: [
    {
      name: String,
      role: String,
      year: String,
      description: String,
    },
  ],
  achievements: [
    {
      title: String,
      level: String,
      year: String,
      date: String,
    },
  ],

  // DOCUMENTS
  documents: [mongoose.Schema.Types.Mixed],
});

export default mongoose.model("Student", studentSchema);
