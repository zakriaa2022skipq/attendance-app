import { LoadingButton } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useMutation, useQuery } from "react-query";
import axios from "../util/axios";
const CheckRecord = () => {
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [lesson, setLesson] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const handleFetchRecord = () => {
    if (lesson == "") {
      setErrMessage("Lesson not selected");
      setShowAlert(true);
      return;
    }
    const formatedDate = attendanceDate.toLocaleDateString("en-CA"); // 2020-08-19 (year-month-day)
    recordMutation.mutate({ lessonId: lesson, date: formatedDate });
  };
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
  const recordMutation = useMutation(
    (body) =>
      axios
        .post(`api/v1/attendance/`, body, { withCredentials: true })
        .then((response) => response.data?.attendance),
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
  const lessonList =
    isSuccess &&
    data.map((lesson) => {
      return (
        <MenuItem value={lesson._id} key={lesson._id}>
          title: {lesson.title} grade: {lesson.grade}{" "}
        </MenuItem>
      );
    });
  const records =
    recordMutation.isSuccess &&
    recordMutation.data.length > 0 &&
    recordMutation.data.map((record) => {
      return (
        <Fragment key={record._id}>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {record.student[0].firstName}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {record.student[0].lastName}
          </p>
          <p className="  mb-1 border-b border-gray-500 text-center">
            {record.status}
          </p>
        </Fragment>
      );
    });
  return (
    <div className="mt-20">
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
            onChange={(event) => {
              setLesson(event.target.value);
            }}
            className="h-10 "
          >
            {lessonList}
          </Select>
        </FormControl>
        <div>
          <LoadingButton
            loading={recordMutation.isLoading}
            onClick={handleFetchRecord}
            type="submit"
            variant="outlined"
            sx={{
              fontSize: "10px",
              ":hover": {
                backgroundColor: "tranparent",
              },
            }}
          >
            <span>Fetch Record</span>
          </LoadingButton>
        </div>
      </div>
      <div className="grid grid-cols-3 m-4">
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          First Name
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Last Name
        </p>
        <p className="text-base font-medium mb-1 border border-gray-500 text-center">
          Status
        </p>
        {records}
      </div>
      {recordMutation.isSuccess && recordMutation.data.length < 1 && (
        <div className="m-4">
          <p>
            No record for selected date and lesson. Marked attendance will be
            shown in record.
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckRecord;
