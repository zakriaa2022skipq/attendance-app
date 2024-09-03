const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        trim: true,
      },
      lessons: {
        type: [
          {
            
              type: mongoose.Schema.Types.ObjectId,
              ref: "Lesson",
              required: true,
            
          },
        ],
      },

  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;