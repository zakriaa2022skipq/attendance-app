import * as React from "react";
import axios from "../util/axios";
import { toast } from "sonner";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useState } from "react";
import StudentModal from "../components/StudentModal";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";

const Students = () => {
  const [errMessage, setErrMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [addStudentModal, setAddStudentModal] = useState(false);
  const navigate = useNavigate();

  const fetchStudent = () =>
    axios
      .get(`api/v1/student/all`, {
        withCredentials: true,
      })
      .then((response) => response.data.students);
  const { data, isError, isFetching, isSuccess, refetch } = useQuery(
    "student-list",
    fetchStudent,
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
  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const students =
    isSuccess &&
    data.map((student) => {
      return (
        <Fragment key={student._id}>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {student.firstName}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {student.lessons}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {student.email}
          </p>
          <p
            className="  mb-1 border-b border-gray-500 text-center"
            onClick={() => {
              navigate(`/portal/studentdetail/${student._id}`, {
                state: { student },
              });
            }}
          >
            <Button sx={{ fontSize: "10px" }}>view detail</Button>
          </p>
        </Fragment>
      );
    });

  return (
    <div className="mx-auto mt-20">
      <div className="ml-auto">
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "hsl(169, 40%, 55%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ":hover": {
              backgroundColor: "hsl(169, 60%, 55%)",
            },
          }}
          onClick={() => {
            setAddStudentModal(true);
          }}
        >
          Add Student
        </Button>
      </div>
      <div className="grid grid-cols-4 m-4">
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          First Name
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Lessons
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          email
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          detail
        </p>
        {students}
      </div>
      <StudentModal
        addStudentModal={addStudentModal}
        setAddStudentModal={setAddStudentModal}
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

export default Students;
