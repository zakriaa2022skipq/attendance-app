import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import axios from '../util/axios';

function LessonModal({
  addLessonModal,
  setAddLessonModal,
  refetch
}) {
  const handleClose = () => setAddLessonModal(false);

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
  const LessonSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(10, 'Title cannot exceed 10 char limit. Too Long!')
      .required('Required'),
    grade: Yup.string()
      .min(1, 'Too Short!')
      .max(10, 'grade cannot exceed 10 char limit. Too Long!')
      .required('Required'),
  });
  const lessonMutation = useMutation(
    (lessonBody) =>
      axios.post(`api/v1/lesson/add`, lessonBody, { withCredentials: true }),
    {
      onSuccess: () => {
        refetch()
        setAddLessonModal(false);
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
    lessonMutation.mutate({ title: values.title,grade:values.grade });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      grade:''
    },
    validationSchema: LessonSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <Modal
        open={addLessonModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
          {lessonMutation.isError && showAlert && (
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
            id="title"
            label="title"
            variant="standard"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.title && formik.errors.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
          />
          <TextField
            id="grade"
            label="grade"
            variant="standard"
            value={formik.values.grade}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.grade && formik.errors.grade}
            error={formik.touched.grade && Boolean(formik.errors.grade)}
          />
          <LoadingButton
            loading={lessonMutation.isLoading}
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
            <span>Add Lesson</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

export default LessonModal;