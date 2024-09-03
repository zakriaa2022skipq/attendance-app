import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserState } from "../features/user/userSlice";
import * as Yup from "yup";
import axios from "../util/axios";

const Landing = () => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const SigninSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const navigate = useNavigate();

  const loginMutation = useMutation(
    (loginData) =>
      axios
        .post("api/v1/student/detail/email", loginData, {
          withCredentials: true,
        })
        .then((response) => response.data?.studentDetail[0]),
    {
      onSuccess: (data) => {
        dispatch(updateUserState(data));
        navigate("/home");
      },
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
  const handleSubmit = async (values) => {
    loginMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: SigninSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7fcf8",
          flexDirection: "column",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            px: "20px",
            py: "40px",
            width: "450px",
            textAlign: "center",
            backgroundColor: "var(--primary-button)",
            maxWidth: "80vw",
            borderColor: "hsl(180, 27%, 58%)",
          }}
        >
          {loginMutation.isError && showAlert && (
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
          <CardContent>
            <Typography fontSize="40px" sx={{ color: "hsl(169, 79%, 48%)" }}>
              Student Attendance Portal
            </Typography>
            <Typography fontSize="28px" sx={{ color: "hsl(169, 79%, 37%)" }}>
              Check your attendance in lessons
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <TextField
                id="email"
                label="Enter your email"
                variant="standard"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.email && formik.errors.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                sx={{
                  "& .MuiInput-root:before": {
                    borderColor: "hsl(180, 27%, 58%)",
                  },
                  "& .MuiInput-root:after": {
                    borderColor: "hsl(180, 35%, 50%)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "hsl(169, 75%, 50%)",
                  },
                }}
              />

              <LoadingButton
                loading={loginMutation.isLoading}
                type="submit"
                variant="outlined"
                disabled={formik.isSubmitting}
                sx={{
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
                <span>Check record</span>
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Landing;
