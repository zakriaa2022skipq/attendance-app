import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import axios from "../util/axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const userDetail = useSelector((state) => state.user);
  const lessons = userDetail.lessons;
  const [lesson, setLesson] = useState("");
  const navigate = useNavigate();
  const handleChange = (event) => {
    setLesson(event.target.value);
  };
  const studentAttendanceMutation = useMutation(
    (body) =>
      axios
        .post(`api/v1/attendance/student/lesson`, body, {
          withCredentials: true,
        })
        .then((response) => response.data?.attendanceDetail),
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
  const handleFetchAttendance = () => {
    if (lesson == "") {
      setErrMessage("Lesson not selected");
      setShowAlert(true);
      return;
    }
    studentAttendanceMutation.mutate({
      lessonId: lesson,
      studentId: userDetail._id,
    });
  };
  const attendanceList =
    studentAttendanceMutation.isSuccess &&
    studentAttendanceMutation.data.map((entry) => {
      const formatedDate = new Date(entry.date).toLocaleDateString("pt-PT");
      return (
        <Fragment key={entry._id}>
          <p className="text-base font-light  border-b border-gray-500 text-center">
            {formatedDate}
          </p>
          <p className="text-base font-light  border-b border-gray-500 text-center">
            {entry.status}
          </p>
        </Fragment>
      );
    });
  const lessonList = lessons.map((lesson) => {
    return (
      <MenuItem value={lesson._id} key={lesson._id}>
        title: {lesson.title} grade: {lesson.grade}{" "}
      </MenuItem>
    );
  });
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Student Portal
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <div className="m-4 flex justify-center">
        <div className="border border-gray-400 p-10">
          <Typography
            variant="h5"
            component="div"
            sx={{ textAlign: "center", margin: "8px" }}
          >
            Student Detail
          </Typography>
          <Typography variant="body2" sx={{ margin: "12px" }}>
            <span className="text-slate-600">First Name: </span>
            {userDetail.firstName}
          </Typography>
          <Typography variant="body2" sx={{ margin: "12px" }}>
            <span className="text-slate-600">Last Name: </span>
            {userDetail?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ margin: "12px" }}>
            <span className="text-slate-600">Email: </span>
            {userDetail?.email}
          </Typography>
          <Typography variant="body2" sx={{ margin: "12px" }}>
            <span className="text-slate-600">Lessons Enrolled: </span>
            {lessons?.length}
          </Typography>
        </div>
      </div>
      <div className="flex mt-5 justify-center items-center mx-4 gap-2">
        <FormControl fullWidth className="max-w-72 ">
          <InputLabel id="lesson">Lesson</InputLabel>
          <Select
            labelId="lesson"
            id="lesson"
            value={lesson}
            label="Lesson Enrolled by student"
            onChange={handleChange}
            className="h-10 "
          >
            {lessonList}
          </Select>
        </FormControl>
        <div>
          <LoadingButton
            loading={studentAttendanceMutation.isLoading}
            onClick={handleFetchAttendance}
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
            disabled={lessons.length < 1}
          >
            <span>Fetch Attendance</span>
          </LoadingButton>
          {lessons.length < 1 && (
            <p>
              Not enrolled in any lesson. Contact admin to enroll in lesson.
            </p>
          )}
        </div>
      </div>
      {studentAttendanceMutation.isSuccess && (
        <div className="grid grid-cols-2 my-4 max-w-[550px] mx-auto">
          <p className="text-base font-medium mb-1 border border-gray-500 text-center">
            Date
          </p>
          <p className="text-base font-medium mb-1 border border-gray-500 text-center">
            Attendance
          </p>
          {attendanceList}
        </div>
      )}
    </div>
  );
};

export default Home;
