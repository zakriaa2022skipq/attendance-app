import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import axios from "../util/axios";

const Home = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const fetchStats = () =>
    axios
      .get(`api/v1/student/studentsandlessons`, {
        withCredentials: true,
      })
      .then((response) => response.data);
  const { data, isLoading, isSuccess } = useQuery("stats-home", fetchStats, {
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
  });
  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  return (
    <div>
      {isSuccess && (
        <Box
          sx={{
            padding: "100px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Card sx={{ minWidth: 225 }}>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Number of Students Registered
              </Typography>
              <Typography variant="body2">
                {data.numberOfStudents}
                <br />
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Number of Lessons Registered
              </Typography>
              <Typography variant="body2">
                {data.numberOfLessons}
                <br />
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      {isLoading && (
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

export default Home;
