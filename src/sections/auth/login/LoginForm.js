import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import AUTH from '../../../localization/str';
// eslint-disable-next-line import/no-named-default
import {default as U, jwt} from '../../../api/urls';

// ----------------------------------------------------------------------
axios.defaults.withCredentials = true;
const STRINGS = AUTH.auth;

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    handle: Yup.string().required(STRINGS.handleRequired),
    password: Yup.string().required(STRINGS.passwordRequired),
  });

  const formik = useFormik({
    initialValues: {
      handle: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, {setSubmitting}) => {
      const formData = new FormData();
      formData.append("username", values.handle);
      formData.append("password", values.password);

      axios.post(U(`/auth/login?expires=${values.remember?86400*7:86400}`), formData, {withCredentials: true}).then(resp=>{
        setSubmitting(false);

        if(resp.status !== 200 || !('jwt' in resp.data))
        {
          alert(`${STRINGS.loginFailed}${resp.data}`);
          return;
        }
        jwt.value = resp.data.jwt;
        axios.defaults.headers.common.jwt = jwt;

        
        navigate('/dashboard', { replace: true });
      }).catch((reason)=>{
        setSubmitting(false);

        if(reason.response.status === 401)
        {
          alert(`${STRINGS.unauthorized}\n${reason.response.data.detail}`);
          return;
        }
        alert(reason);
      });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label={STRINGS.remember}
          />

          <Link component={RouterLink} variant="subtitle2" to="#建议重开" underline="hover">
            {STRINGS.forgotPw}
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {AUTH.nav.login}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
