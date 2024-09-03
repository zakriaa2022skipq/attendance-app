import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "../util/axios";
import { toast } from "sonner";

function LessonEnrollModal({
  lessonEnrollModal,
  setLessonEnrollModal,
  refetch,
  studentId,
}) {
  const handleClose = () => setLessonEnrollModal(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [lesson, setLesson] = useState("");

  const handleChange = (event) => {
    setLesson(event.target.value);
  };
  const fetchLesson = () =>
    axios
      .get(`api/v1/lesson/all`, {
        withCredentials: true,
      })
      .then((response) => response.data.lessons);
  const { data, isError, isFetching, isSuccess } = useQuery(
    "lesson-list",
    fetchLesson,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const enrollLessonMutation = useMutation(
    (body) =>
      axios.post(`api/v1/lesson/student/add`, body, { withCredentials: true }),
    {
      onSuccess: () => {
        refetch();
        setLessonEnrollModal(false);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lesson == "") {
      setErrMessage("Lesson not selected");
      setShowAlert(true);
      return;
    }
    enrollLessonMutation.mutate({ lessonId: lesson, studentId });
  };
  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const lessonList =
    isSuccess &&
    data.map((lesson) => {
      return (
        <MenuItem value={lesson._id} key={lesson._id}>
          title: {lesson.title} grade: {lesson.grade}{" "}
        </MenuItem>
      );
    });

  return (
    <div>
      <Modal open={lessonEnrollModal} onClose={handleClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          {enrollLessonMutation.isError && showAlert && (
            <Alert
              sx={{ maxWidth: "100%" }}
              onClose={() => {
                setShowAlert(false);
              }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              {errMessage}
            </Alert>
          )}
          <FormControl fullWidth>
            <InputLabel id="lesson">Lesson</InputLabel>
            <Select
              labelId="lesson"
              id="lesson"
              value={lesson}
              label="Lesson"
              onChange={handleChange}
            >
              {lessonList}
            </Select>
          </FormControl>
          <LoadingButton
            loading={enrollLessonMutation.isLoading}
            type="submit"
            variant="outlined"
            sx={{
              mt: "12px",
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
          >
            <span>Enroll in Lesson</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

export default LessonEnrollModal;
