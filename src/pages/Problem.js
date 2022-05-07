import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import MathJax from 'react-mathjax';

import AceEditor from 'react-ace';

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
import "ace-builds/src-noconflict/mode-ada";
import "ace-builds/src-noconflict/mode-cobol";
import "ace-builds/src-noconflict/mode-coffee";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-d";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-fortran";
import "ace-builds/src-noconflict/mode-forth";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-groovy";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-fsharp";
import "ace-builds/src-noconflict/mode-vbscript";
import "ace-builds/src-noconflict/mode-ocaml";
import "ace-builds/src-noconflict/mode-pascal";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-prolog";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-lisp";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-scheme";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";


// components

import DropdownMenu from '../components/DropdownMenu';

// import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// eslint-disable-next-line import/no-named-default
import {default as U, jwt} from '../api/urls';
import CommonDescBlock from './problemblock/common';
import SampleBlock from './problemblock/half';
import LOCALIZATIONPACK from '../localization/str';
// ----------------------------------------------------------------------
axios.defaults.withCredentials = true;





function DescBlock({ type, ...other }) {
  if(['sample_input', 'sample_output'].indexOf(type)!==-1) return <SampleBlock {...other}/>;
  return <CommonDescBlock {...other}/>;
}


export default function Problem() {

  const langMap = {
    'default': 'Default',
    'zh': '简体中文',
    'en': 'English'
  };

  const [lang, setLang] = useState([
    'default',
    'zh',
    'en',
  ]);

  const [runtimes, setRuntimes] = useState([]);

  const [selectedRuntime, setSelectedRuntime] = useState({pk:'CPP20', label:'CPP20', ace:'c_cpp'});

  const onsetRT = (option) => {
    console.log('new:', option);
    console.log('li:', runtimes);
    setSelectedRuntime(option);
  }

  const [selectedLang, setSelectedLang] = useState({pk:'default', label:'Default'});

  const { problemId } = useParams();

  const navigate = useNavigate();

  const [shouldRequest, setShouldRequest] = useState(true);

  const [problemData, setProblemData] = useState(
    {
      code: "Loading...",
      date: "2017-02-09T19:32:32",
      desc: { default: [{ head: 'loading...', body: 'loading...' }] },
      desc_type: "M",
      difficulty: null,
      discussion_handle: null,
      discussion_shown: true,
      is_public: true,
      memory_limit: 131072,
      partial: false,
      pk: "csu1003",
      short_circuit: true,
      solution_handle: null,
      solution_shown: true,
      solved: 0,
      source_visibility: "F",
      submitted: 0,
      time_limit: 1,
      title: "Loading...",
      types: [],
    }
  );

  const getProblem = () => {
    if (shouldRequest) {
      setShouldRequest(false);
      getRuntime();

      axios.get(U(`/problem/${problemId}`), { withCredentials: true }).then(resp => {
        console.log(resp.data.desc);
        setLang(Object.keys(resp.data.desc));
        setProblemData(resp.data);
      }).catch(reason => {
        console.log(reason);
        console.log(reason.response);
        
        if (reason.response.status === 404) {
          navigate('/404', { replace: true });
        }
      })
    }
  };
  const getRuntime = () => {
    axios.get(U(`/runtime/`)).then(resp => {
      console.log(resp.data);
      setRuntimes(resp.data.data);
      console.log(runtimes);
    }).catch(reason => {
      console.log(reason);
      console.log(reason.response);
    })
  };

  useEffect( () => {
    getProblem();
  });

  // const tmp = lang.map((x)=>({pk:x, label:langMap[x]}));

  // console.log('MAPPING:', tmp);

  const [editor, initEditor] = useState(undefined);

  const submit = () => {
    console.log(editor.getValue());
    console.log({
      source: editor.getValue(),
      problem_id: problemData.pk,
      lang: selectedRuntime.pk
    });
    console.log(selectedRuntime);
    axios.defaults.headers.common.jwt = jwt.value;

    axios.post(U(`/submission/`), {
      source: editor.getValue(),
      problem_id: problemData.pk,
      lang: selectedRuntime.pk
    }).then(resp=>{
      console.log(resp);
      console.log(resp.data.submission_id);
      navigate(`/dashboard/submission/${resp.data.submission_id}`, {replace: true})
    }).catch(reason=>{
      console.log(reason);
      console.log(reason.response);
      if (reason.response.status === 401) {
        alert(reason.response.data.detail);
      }
    });
  };


  return (
    <Page title={problemData.title}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {problemData.title}
          </Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <DropdownMenu 
                itemList={lang.map((x)=>({pk:x, label:langMap[x]}))}
                hint={LOCALIZATIONPACK.problem.showingLang}
                selected={selectedLang}
                setSelected={setSelectedLang}
              />
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          {problemData.desc[selectedLang.pk].map((it, index) =>
            (<DescBlock key={index} id={index} head={it.head} body={it.body} type={it.type} />)
          )}

        <Grid item xs={12} key="editor">
            <Card>

                <CardHeader titleTypographyProps={{ variant: 'h4' }}
                    subheaderTypographyProps={{ variant: 'subtitle1' }}
                    title={LOCALIZATIONPACK.problem.submit} subheader="submit" />
                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
                <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, mx: 3 }}>
                    <DropdownMenu 
                      itemList={runtimes.map((x)=>({pk:x.pk, label:x.name?x.name:x.pk, ace:x.ace?x.ace:"plain_text"}))}
                      hint={LOCALIZATIONPACK.problem.submitLang}
                      selected={selectedRuntime}
                      setSelected={onsetRT}
                    />
                    <Button 
                      color="inherit"
                      onClick={submit}
                      endIcon={<Iconify icon="mdi-send" />}>
                        {LOCALIZATIONPACK.problem.confirm}

                    </Button>
                </Stack>
                </Stack>
                <CardContent>
                  <AceEditor
                    width="100%"
                    mode={selectedRuntime.ace}
                    // onChange={onEdit}
                    onLoad={(x)=>initEditor(x)}
                    showLineNumbers="true"
                    theme="github"
                    fontSize={20}
                  />
                
                </CardContent>
            </Card>
        </Grid>

        </Grid>

      </Container>
    </Page>
  );
}
