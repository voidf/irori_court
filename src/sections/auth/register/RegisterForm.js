import * as Yup from 'yup';
import axios from 'axios';

import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import AUTH from '../../../localization/str';

// eslint-disable-next-line import/no-named-default
import {default as U, jwt} from '../../../api/urls';

// ----------------------------------------------------------------------
axios.defaults.withCredentials = true;
const STRINGS = AUTH.auth;

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    handle: Yup.string().required(STRINGS.handleRequired),
    password: Yup.string().required(STRINGS.passwordRequired),
  });

  const formik = useFormik({
    initialValues: {
      handle: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, {setSubmitting}) => {
      const formData = new FormData();
      formData.append("username", values.handle);
      formData.append("password", values.password);
      console.log(values);

      axios.post(U(`/auth/register`), formData, {withCredentials: true}).then(resp=>{
        setSubmitting(false);

        if(resp.status !== 200 || !('jwt' in resp.data))
        {
          alert(`${STRINGS.registerFailed}${resp.data}`);
          return;
        }
        jwt.value = resp.data.jwt;
        axios.defaults.headers.common.jwt = jwt;
        
        navigate('/dashboard', { replace: true });
      }).catch((reason)=>{
        setSubmitting(false);

        if(reason.response.status === 400)
        {
          if(reason.response.data.detail === 'user handle already exists')
          {
            alert(`${STRINGS.alreadyExists}\n${reason.response.data.detail}`);
          }
          else if(reason.response.data.detail === 'handle or password cannot be empty')
          {
            alert(`${STRINGS.cannotEmpty}\n${reason.response.data.detail}`);
          }
          return;
        }
        alert(reason);
      });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack> */}

          <TextField
            fullWidth
            autoComplete="handle"
            type="text"
            label={STRINGS.handle}
            {...getFieldProps('handle')}
            error={Boolean(touched.handle && errors.handle)}
            helperText={touched.handle && errors.handle}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label={STRINGS.password}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
