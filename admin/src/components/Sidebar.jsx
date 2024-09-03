import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import axios from "../util/axios";
import { updateLoginStatus } from "../features/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const logoutMutation = useMutation(
    () =>
      axios({
        url: "api/v1/admin/logout",
        method: "POST",
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(false));
      },
    }
  );

  return (
    <Box
      sx={{
        backgroundColor: "silver",
        minHeight: "100vh",
        height: "100%",
        margin: "0",
        padding: "0",
      }}
    >
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to={"/portal/home"}>
          <p>Attendance Mangement</p>
        </Link>
        <LoadingButton
          loading={logoutMutation.isLoading}
          onClick={() => {
            logoutMutation.mutate();
          }}
        >
          Logout
        </LoadingButton>
      </Box>
      <Box sx={{ padding: "8px", borderBottom: "1px solid " }}>
        <Link to={"/portal/lessons"}>
          <p>Lessons</p>
        </Link>
      </Box>
      <Box sx={{ padding: "8px", borderBottom: "1px solid " }}>
        <Link to={"/portal/students"}>
          <p>Students</p>
        </Link>
      </Box>
      <Box sx={{ padding: "8px", borderBottom: "1px solid " }}>
        <Link to={"/portal/markattendance"}>
          <p>Mark Attendance</p>
        </Link>
      </Box>
      <Box sx={{ padding: "8px", borderBottom: "1px solid " }}>
        <Link to={"/portal/checkrecord"}>
          <p>Check Record</p>
        </Link>
      </Box>
    </Box>
  );
};

export default Sidebar;
