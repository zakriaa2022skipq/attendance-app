const Student = require('../models/student')
const Lesson  = require("../models/lesson");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const addLesson = asyncHandler(async (req, res) => {
  const { title, grade, } = req.body;
  const lessonExists = await Lesson.findOne({ title,grade });
  if (lessonExists) {
    req.statusCode = 400;
    throw new Error("Lesson with given title and grade already exists");
  }
  const lesson = await Lesson.create({
    title,
    grade
  });
  return res.status(201).json({ msg: "lesson added successfully" });
});
const addStudentToLesson = asyncHandler(async (req, res) => {
  const { studentId,lessonId } = req.body;
  const studentExists = await Student.findOne({_id:studentId})
  if (!studentExists) {
    req.statusCode = 400;
    throw new Error("Student does not exist");
  }
  const lessonExists = await Lesson.findOne({_id:lessonId})
  if(!lessonExists){
    throw new Error('Lesson does not exist')
  }
  const studentUpdate = await Student.updateOne({ _id:studentId },{
    $addToSet: { lessons:  lessonId },
  });

  const lessonUpdate = await Lesson.updateOne({ _id:lessonId  },{$addToSet: { students: studentId },});
  
  return res.status(201).json({ msg: "student registered in lesson successfully" });
});
const removeStudentFromLesson = asyncHandler(async (req, res) => {
  const { studentId,lessonId } = req.body;
  const studentExists = await Student.findOne({ _id:studentId });
  if (!studentExists) {
    req.statusCode = 400;
    throw new Error("Lesson with given title and grade already exists");
  }
  const lessonExists = await Lesson.findOne({ _id:lessonId });
  if (!lessonExists) {
    req.statusCode = 400;
    throw new Error("Lesson with given title and grade already exists");
  }
  const lesson = await Lesson.updateOne(
    { _id: lessonId},
    {
      $pull: { students: studentId },
    }
  );
  const student = await Student.updateOne(
    { _id: studentId},
    {
      $pull: { lessons: lessonId },
    }
  );

  return res.status(200).json({ msg: "lesson removed successfully" });
});
const listOfLessons = asyncHandler(async (req, res) => {
   const lessons = await Lesson.aggregate([
    {'$match': { _id : {$exists: true} } },
    {$project: {students: {$size: '$students'},_id:1,title:1,grade:1}},    
   ])
    return res.status(200).json({ lessons});
});
const studentsInLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;
  const lessonExists = await Lesson.findById({_id:lessonId});
  if (!lessonExists) {
    req.statusCode = 400;
    throw new Error("Lesson does not exist");
  }
  const students = await Lesson.aggregate([
    { $match: { _id: new ObjectId(lessonId) } },
    {
      $lookup: {
        from: "students",
        localField: "students",
        foreignField: "_id",
        as: "students",
      },
    },
    {
      $project: {
        "students.lessons": 0,
      },
    },
  ]);
  return res.status(200).json({ students });
});



module.exports = {  addLesson,addStudentToLesson,removeStudentFromLesson,listOfLessons,studentsInLesson };