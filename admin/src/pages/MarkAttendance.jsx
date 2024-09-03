import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import axios from "../util/axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

const MarkAttendance = () => {
  const [lesson, setLesson] = useState("");
  const [studentIdMarked, setStudentIdMarked] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendancestatus, setAttendancestatus] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const handleChange = (event) => {
    setLesson(event.target.value);
  };
  const handleFetchStudents = () => {
    if (lesson == "") {
      setErrMessage("Lesson not selected");
      setShowAlert(true);
      return;
    }
    studentsInLessonMutation.mutate({ lessonId: lesson });
  };
  const markAttendanceMutation = useMutation(
    (body) =>
      axios.post(`api/v1/attendance/add`, body, { withCredentials: true }),
    {
      onError: (error) => {
        setShowAlert(true);
        if (error.response) {
          if (typeof error.response.data === "string")
            setErrMessage(error.response.data);
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
    }
  );
  const studentsInLessonMutation = useMutation(
    (body) =>
      axios
        .post(`api/v1/lesson/students/all`, body, { withCredentials: true })
        .then((response) => response.data?.students[0].students),
    {
      onError: (error) => {
        setShowAlert(true);
        if (error.response) {
          if (typeof error.response.data === "string")
            setErrMessage(error.response.data);
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
      onSuccess: (data) => {
        const objAttendanceVals = {};
        data.map((val) => {
          objAttendanceVals[val._id] = { status: "present" };
        });
        setAttendancestatus(objAttendanceVals);
      },
    }
  );
  const handleChangeAttendance = (e) => {
    const id = e.target.name;
    const status = e.target.value;
    const newAttendanceStatus = { ...attendancestatus, [id]: { status } };
    setAttendancestatus(newAttendanceStatus);
  };

  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const fetchLesson = () =>
    axios
      .get(`api/v1/lesson/all`, {
        withCredentials: true,
      })
      .then((response) => response.data.lessons);
  const { data, isError, isFetching, isSuccess, refetch } = useQuery(
    "lesson-list",
    fetchLesson,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    {
      onError: (error) => {
        if (error.response) {
          if (typeof error.response.data === "string") {
            setErrMessage(error.response.data);
          }
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
        setShowAlert(true);
      },
    }
  );
  const lessonList =
    isSuccess &&
    data.map((lesson) => {
      return (
        <MenuItem value={lesson._id} key={lesson._id}>
          title: {lesson.title} grade: {lesson.grade}{" "}
        </MenuItem>
      );
    });
  const students =
    studentsInLessonMutation.isSuccess &&
    studentsInLessonMutation.data.length > 0 &&
    studentsInLessonMutation.data.map((student) => {
      return (
        <Fragment key={student._id}>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {student.firstName}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {student.lastName}
          </p>
          <div className="  mb-1 border-b border-gray-500 text-center">
            <RadioGroup
              name="controlled-radio-buttons-group"
              row
              sx={{
                "& ": { justifyContent: "center" },
              }}
              onChange={handleChangeAttendance}
              value={attendancestatus[student._id].status}
            >
              <FormControlLabel
                value="present"
                name={student._id}
                control={<Radio />}
                label="present"
                sx={{
                  "& .MuiFormControlLabel-label ": { fontSize: "10px" },
                  "& .MuiRadio-root": { width: "5px" },
                  "& .MuiSvgIcon-root": {
                    height: 15,
                    width: 15,
                  },
                }}
              />
              <FormControlLabel
                value="absent"
                name={student._id}
                control={<Radio />}
                label="absent"
                sx={{
                  "& .MuiFormControlLabel-label ": { fontSize: "10px" },
                  "& .MuiRadio-root": { width: "5px" },
                  "& .MuiSvgIcon-root": {
                    height: 15,
                    width: 15,
                  },
                }}
              />
            </RadioGroup>
          </div>
          <p className="  mb-1 border-b border-gray-500 text-center">
            <LoadingButton
              onClick={() => {
                setStudentIdMarked(student._id);
                const formatedDate = attendanceDate.toLocaleDateString("en-CA"); // 2020-08-19 (year-month-day)
                markAttendanceMutation.mutate({
                  studentId: student._id,
                  lessonId: lesson,
                  date: formatedDate,
                  status: attendancestatus[student._id].status,
                });
              }}
              loading={
                markAttendanceMutation.isLoading &&
                student._id == studentIdMarked
              }
              type="submit"
              variant="outlined"
              sx={{
                fontSize: "10px",
                color: "hsl(169, 75%, 50%)",
                borderColor: "hsl(169, 79%, 48%)",
                ":hover": {
                  borderColor: "hsl(169, 79%, 48%)",
                  backgroundColor: "tranparent",
                },
                ".MuiLoadingButton-loadingIndicator": {
                  color: "hsl(169, 79%, 48%)",
                },
              }}
            >
              Mark Attendance
            </LoadingButton>
          </p>
        </Fragment>
      );
    });
  return (
    <div>
      <div className="flex mt-5 justify-between items-center mx-4">
        <DatePicker
          showIcon
          selected={attendanceDate}
          onChange={(date) => setAttendanceDate(date)}
          className="bg-slate-400 w-32 "
        />
        <FormControl fullWidth className="max-w-72 ">
          <InputLabel id="lesson">Lesson</InputLabel>
          <Select
            labelId="lesson"
            id="lesson"
            value={lesson}
            label="Lesson"
            onChange={handleChange}
            className="h-10 "
          >
            {lessonList}
          </Select>
        </FormControl>
        <div>
          <LoadingButton
            loading={studentsInLessonMutation.isLoading}
            onClick={handleFetchStudents}
            type="submit"
            variant="outlined"
            sx={{
              fontSize: "10px",
              color: "hsl(169, 75%, 50%)",
              borderColor: "hsl(169, 79%, 48%)",
              ":hover": {
                borderColor: "hsl(169, 79%, 48%)",
                backgroundColor: "tranparent",
              },
              ".MuiLoadingButton-loadingIndicator": {
                color: "hsl(169, 79%, 48%)",
              },
            }}
          >
            <span>Fetch Students</span>
          </LoadingButton>
        </div>
      </div>
      <div className="grid grid-cols-4 m-4">
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          First Name
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Last Name
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Status
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Mark
        </p>
        {students}
      </div>
      {studentsInLessonMutation.isSuccess &&
        studentsInLessonMutation.data.length < 1 && (
          <div className="m-4">
            <p>No students enrolled in this lesson. Enroll students.</p>
          </div>
        )}
    </div>
  );
};

export default MarkAttendance;
