import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import axios from '../util/axios';

function StudentModal({
  addStudentModal,
  setAddStudentModal,
  refetch
}) {
  const handleClose = () => setAddStudentModal(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
  };
  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const StudentSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(20, 'Title cannot exceed 10 char limit. Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(1, 'Too Short!')
      .max(20, 'grade cannot exceed 10 char limit. Too Long!')
      .required('Required'),
    email:Yup.string().email()
  });
  const studentMutation = useMutation(
    (body) =>
      axios.post(`api/v1/student/register`, body, { withCredentials: true }),
    {
      onSuccess: () => {
        refetch()
        setAddStudentModal(false);
      },
      onError: (error) => {
        setShowAlert(true);
        if (error.response) {
          if (typeof error.response.data === 'string') setErrMessage(error.response.data);
        } else if (error.request) {
          setErrMessage(error.message);
        } else {
          setErrMessage(error.message);
        }
      },
    },
  );
  const handleSubmit = async (values) => {
    studentMutation.mutate({ firstName: values.firstName,lastName:values.lastName,email:values.email});
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName:'',
      email:''
    },
    validationSchema: StudentSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <Modal
        open={addStudentModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
          {studentMutation.isError && showAlert && (
            <Alert
              sx={{ maxWidth: '100%' }}
              onClose={() => {
                setShowAlert(false);
              }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              {errMessage}
            </Alert>
          )}
          <TextField
            id="firstName"
            label="firstName"
            variant="standard"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.firstName && formik.errors.firstName}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          />
          <TextField
            id="lastName"
            label="lastName"
            variant="standard"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.lastName && formik.errors.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          />
          <TextField
            id="email"
            label="email"
            variant="standard"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.email && formik.errors.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <LoadingButton
            loading={studentMutation.isLoading}
            type="submit"
            variant="outlined"
            disabled={formik.isSubmitting}
            sx={{
              mt: '12px',
              width: 'max-content',
              color: 'hsl(169, 75%, 50%)',
              borderColor: 'hsl(169, 79%, 48%)',
              ':hover': {
                borderColor: 'hsl(169, 79%, 48%)',
                backgroundColor: 'tranparent',
              },
              '.MuiLoadingButton-loadingIndicator': {
                color: 'hsl(169, 79%, 48%)',
              },
            }}
          >
            <span>Add Student</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

export default StudentModal;