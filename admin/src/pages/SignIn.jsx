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
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { updateLoginStatus } from "../features/auth/authSlice";
import axios from "../util/axios";

function SignIn() {
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();
  const SigninSchema = Yup.object().shape({
    password: Yup.string()
      .min(5, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    username: Yup.string()
      .min(4, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    (loginData) =>
      axios.post("api/v1/admin/signin", loginData, { withCredentials: true }),
    {
      onSuccess: () => {
        dispatch(updateLoginStatus(true));
        queryClient.invalidateQueries({ queryKey: "userDetail" });
        navigate("/portal/home");
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
      username: "",
      password: "",
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
              Attendance Portal
            </Typography>
            <Typography fontSize="28px" sx={{ color: "hsl(169, 79%, 37%)" }}>
              Admin Signin
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <TextField
                id="username"
                label="Username"
                variant="standard"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.username && formik.errors.username}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
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
              <TextField
                id="password"
                label="Password"
                variant="standard"
                type="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
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
                <span>Submit</span>
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default SignIn;
