import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import MathJax from 'react-mathjax';
// @mui

import {
  Button,
  Typography,
  Container,
  Box,
  Stack,
  Card,
  Menu,
  MenuItem,
  CardHeader,
  CardContent,
  Grid,
  Paper,
  TextareaAutosize,
  TextField,
  CssBaseline,
  ThemeProvider
} from '@mui/material';

// components

import DropdownMenu from '../components/DropdownMenu';

// import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import Page from '../components/Page';
// eslint-disable-next-line import/no-named-default
import {default as U, jwt} from '../api/urls';
import CommonDescBlock from './problemblock/common';
import SampleBlock from './problemblock/half';
import LOCALIZATIONPACK from '../localization/str';
import CaseBlock from '../components/CaseBlock';

// ----------------------------------------------------------------------
const loc = LOCALIZATIONPACK.submission;
axios.defaults.withCredentials = true;

const SUBMISSION_RESULT = {
    'AC': 'Accepted',
    'WA': 'Wrong Answer',
    'TLE': 'Time Limit Exceeded',
    'MLE': 'Memory Limit Exceeded',
    'OLE': 'Output Limit Exceeded',
    'IR': 'Invalid Return',
    'RTE': 'Runtime Error',
    'CE': 'Compile Error',
    'IE': 'Internal Error',
    'SC': 'Short circuit',
    'AB': 'Aborted',
}

export default function Submission() {
  const [shouldRequest, setShouldRequest] = useState(true);
  const { submissionId } = useParams();
  const navigate = useNavigate();


  const [sub, setSub] = useState(undefined);
  const [cases, setCases] = useState([]);


  const getSubmission = () => {
    if (shouldRequest) {
      setShouldRequest(false);

      axios.defaults.headers.common.jwt = jwt.value;
      axios.get(U(`/submission/${submissionId}`), { withCredentials: true }).then(resp => {
        console.log(resp.data);
        setSub(resp.data);
        setCases(resp.data.cases);
      }).catch(reason => {
        console.log(reason);
        console.log(reason.response);
        
        if (reason.response.status === 404) {
          navigate('/404', { replace: true });
        }
      })
    }
  };


  useEffect(getSubmission);

  return (
    <Page title={`${loc.title} #${submissionId}`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {`${loc.title} #${submissionId}`}
          </Typography>
          {sub && (<Typography variant="subtitle1" gutterBottom>
            {SUBMISSION_RESULT[sub.result]}
          </Typography>)}
        </Stack>

        <Grid container spacing={3}>
          {cases.map((it, index) =>
            (<CaseBlock key={it.case} pk={it.case} result={it.status} time={it.time} memory={it.memory} />)
          )}


        </Grid>

      </Container>
    </Page>
  );
}
