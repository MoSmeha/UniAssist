import mongoose from "mongoose";
import { Majors, Subjects, Departments } from "./Constants.js";
const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  subject: { type: String, required: true, enum: Subjects },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  mode: {
    type: String,
    enum: ["campus", "online"],
    required: true,
  },
  room: { type: String, required: true },
});

const options = { discriminatorKey: "role", timestamps: true };

const UserSchema = new mongoose.Schema(
  {
    uniId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, select: false },
    gender: { type: String, required: true, enum: ["male", "female"] },
    profilePic: { type: String, default: "" },
    Department: {
      type: String,
      required: true,
      enum: Departments,
    },
    schedule: [ScheduleSchema],
  },
  options
);

const User = mongoose.model("User", UserSchema);

const TeacherSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Teacher = User.discriminator("teacher", TeacherSchema);

const StudentSchema = new mongoose.Schema({
  major: {
    type: String,
    required: true,
    enum: Majors,
  },
});

const Student = User.discriminator("student", StudentSchema);

const AdminSchema = new mongoose.Schema({
  title: { type: String, required: true },
});
const Admin = User.discriminator("admin", AdminSchema);

export { User, Teacher, Student, Admin };
