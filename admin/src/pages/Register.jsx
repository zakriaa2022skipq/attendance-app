import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "../util/axios";

function Register() {
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(5, "Too Short!")
      .max(20, "Too Long!")
      .required("Required"),
    username: Yup.string()
      .min(4, "Too Short!")
      .max(20, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const registerMutation = useMutation(
    (registerData) => axios.post("api/v1/admin/register", registerData),
    {
      onSuccess: () => {
        navigate("/signin");
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
  useEffect(() => {
    if (showAlert && errMessage) {
      toast.error(errMessage);
      setErrMessage("");
      setShowAlert(false);
    }
  }, [errMessage, showAlert]);
  const handleSubmit = (formFields) => {
    registerMutation.mutate(formFields);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          px: "20px",
          py: "20px",
          width: "450px",
          textAlign: "center",
          borderColor: "hsl(180, 27%, 58%)",
          maxWidth: "80vw",
          my: "20px",
        }}
      >
        {" "}
        {showAlert && (
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
            Admin Portal
          </Typography>
          <Typography
            fontSize="28px"
            sx={{ color: "hsl(169, 79%, 37%)", pb: "12px" }}
          >
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Box sx={{ display: "flex", gap: "16px" }}>
              <TextField
                id="username"
                label="username"
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
                data-testid="register-form"
              />
              <TextField
                id="email"
                label="email"
                variant="standard"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
            </Box>

            <TextField
              id="name"
              label="name"
              variant="standard"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{
                "& .MuiInput-root:before": {
                  borderColor: "hsl(180, 27%, 58%)",
                },
                "& .MuiInput-root:after": { borderColor: "hsl(180, 35%, 50%)" },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "hsl(169, 75%, 50%)",
                },
              }}
            />
            <TextField
              id="password"
              label="password"
              variant="standard"
              type="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                "& .MuiInput-root:before": {
                  borderColor: "hsl(180, 27%, 58%)",
                },
                "& .MuiInput-root:after": { borderColor: "hsl(180, 35%, 50%)" },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "hsl(169, 75%, 50%)",
                },
              }}
            />

            <LoadingButton
              loading={registerMutation.isLoading}
              disabled={registerMutation.isLoading}
              type="submit"
              variant="outlined"
              sx={{
                color: "hsl(169, 75%, 50%)",
                borderColor: "hsl(169, 79%, 48%)",
                ":hover": {
                  borderColor: "hsl(169, 79%, 48%)",
                  backgroundColor: "tranparent",
                },
              }}
            >
              Submit
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
