import * as React from "react";
import axios from "../util/axios";
import { toast } from "sonner";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useState } from "react";
import LessonModal from "../components/LessonModal";
import { Box, Button, CircularProgress } from "@mui/material";
import { Fragment } from "react";

const Lesson = () => {
  const [errMessage, setErrMessage] = useState("");
  const [addLessonModal, setAddLessontModal] = useState(false);

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
      },
    }
  );
  useEffect(() => {
    if (isError) {
      toast.error(errMessage);
    }
  }, [errMessage, isError]);
  const lessons =
    isSuccess &&
    data.map((lesson) => {
      return (
        <Fragment key={lesson._id}>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {lesson.title}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {lesson.grade}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {lesson.students}
          </p>
        </Fragment>
      );
    });

  return (
    <div className="mx-auto mt-20">
      <div className="ml-auto">
        <Button
          variant="outlined"
          size="small"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setAddLessontModal(true);
          }}
        >
          Add Lesson
        </Button>
      </div>
      <div className="grid grid-cols-3 m-4">
        <p className="text-2xl font-medium mb-1 border border-gray-500 text-center">
          Lesson
        </p>
        <p className="text-2xl font-medium mb-1 border border-gray-500 text-center">
          Grade
        </p>
        <p className="text-2xl font-medium mb-1 border border-gray-500 text-center">
          Student
        </p>
        {lessons}
      </div>
      <LessonModal
        addLessonModal={addLessonModal}
        setAddLessonModal={setAddLessontModal}
        refetch={refetch}
      />
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
    </div>
  );
};

export default Lesson;
