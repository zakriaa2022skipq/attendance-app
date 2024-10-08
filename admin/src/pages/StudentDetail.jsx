import React, { Fragment } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../util/axios";
import { Box, Button, CircularProgress } from "@mui/material";
import LessonEnrollModal from "../components/LessonEnrollModal";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "sonner";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const StudentDetail = () => {
  const { studentId } = useParams();
  const [unEnrollLesson, setUnEnrollLesson] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [lessonEnrollModal, setLessonEnrollModal] = useState(false);

  const { isSuccess, data, isFetching, refetch } = useQuery(
    `fetchStudentDetail-${studentId}`,
    () =>
      axios
        .get(`api/v1/student/detail/${studentId}/`, { withCredentials: true })
        .then((response) => response.data.studentDetail),
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
  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const unEnrollMutation = useMutation(
    (body) =>
      axios.post(`api/v1/lesson/student/remove`, body, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        refetch();
      },
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

  const studentData = isSuccess && data[0];
  const lessonsEnrolled =
    isSuccess &&
    data[0].lessons.map((lesson) => {
      return (
        <Fragment key={lesson._id}>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {lesson.title}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {lesson.grade}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            <LoadingButton
              loading={
                unEnrollMutation.isLoading && lesson._id == unEnrollLesson
              }
              sx={{
                fontSize: "10px",
                width: "max-content",
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
              onClick={() => {
                setUnEnrollLesson(lesson._id);
                unEnrollMutation.mutate({ lessonId: lesson._id, studentId });
              }}
            >
              Un-Enroll
            </LoadingButton>
          </p>
        </Fragment>
      );
    });
  const card = (
    <React.Fragment>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ textAlign: "center", margin: "8px" }}
        >
          Student Detail
        </Typography>
        <Typography variant="body2">
          <span className="text-slate-600">First Name: </span>
          {studentData.firstName}
        </Typography>
        <Typography variant="body2">
          <span className="text-slate-600">Last Name: </span>
          {studentData?.lastName}
        </Typography>
        <Typography variant="body2">
          <span className="text-slate-600">Email: </span>
          {studentData?.email}
        </Typography>
        <Typography variant="body2">
          <span className="text-slate-600">Lessons Enrolled: </span>
          {lessonsEnrolled?.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            setLessonEnrollModal(true);
          }}
        >
          Enroll Lesson
        </Button>
      </CardActions>
    </React.Fragment>
  );
  return (
    <div className="my-10 mt-20">
      <Box sx={{ minWidth: 275, maxWidth: "300px", mx: "auto" }}>
        <Card variant="outlined">{card}</Card>
      </Box>
      <div className="grid grid-cols-3 m-4">
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Title
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Grade
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Edit
        </p>
        {lessonsEnrolled}
      </div>
      {isFetching && (
        <Box
          sx={{
            color: "hsl(180, 43%, 41%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: "16px",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      <LessonEnrollModal
        lessonEnrollModal={lessonEnrollModal}
        setLessonEnrollModal={setLessonEnrollModal}
        refetch={refetch}
        studentId={studentId}
      />
    </div>
  );
};

export default StudentDetail;
