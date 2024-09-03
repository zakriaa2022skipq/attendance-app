const mongoose = require("mongoose");
const Student = require("./student");

const lessonSchema = mongoose.Schema(
  {
    students: {
        type: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
              required: true,
          },
        ],
      },
    title: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;