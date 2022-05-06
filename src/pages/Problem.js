import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
// import MathJax from 'react-mathjax';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeMathjax from 'rehype-mathjax'
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import AceEditor from 'react-ace';

// @mui

import { styled, useTheme, createTheme } from '@mui/material/styles';
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
import { CopyBlock, dracula } from "react-code-blocks";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import Consolas from '../assets/ConsolasHybrid1.12.ttf'

// components
import Iconify from '../components/Iconify';
// import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import Page from '../components/Page';
// eslint-disable-next-line import/no-named-default
import { default as U, ossUrl} from '../api/urls';
import LOCALIZATIONPACK from '../localization/str';
// ----------------------------------------------------------------------
axios.defaults.withCredentials = true;
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

const protocols = ['http', 'https', 'mailto', 'tel']

/**
 * @param {string} uri
 * @returns {string}
 */
function uriTransformerForOss(uri) {
  const url = (uri || '').trim()
  const first = url.charAt(0)

  if (first === '#') {
    return url
  }
  if (first === '/') {
    const li = uri.split('/');
    // console.log(li);
    if(li[0]==='' && li[1]==='oss' && li[2].length===24)
      return ossUrl + url;
    return url;
  }

  const colon = url.indexOf(':')
  if (colon === -1) {
    return url
  }

  let index = -1
  // eslint-disable-next-line no-plusplus
  while (++index < protocols.length) {
    const protocol = protocols[index]

    if (
      colon === protocol.length &&
      url.slice(0, protocol.length).toLowerCase() === protocol
    ) {
      return url
    }
  }

  index = url.indexOf('?')
  if (index !== -1 && colon > index) {
    return url
  }

  index = url.indexOf('#')
  if (index !== -1 && colon > index) {
    return url
  }

  // eslint-disable-next-line no-script-url
  return 'javascript:void(0)'
}

function wrapMathJax(s) {
  let x = false;
  let cS = 0;
  const output = [];
  for (let i = 0; i < s.length; i += 1) {
    if (s.charAt(i) === '$') {
      if (cS === 1) {
        if (x) {
          output.push("}\n$$");
        }
        else {
          output.push("$$ \n\\displaylines{");
        }
        cS = 0;
        x = !x;
      } else {
        cS = 1;
      }
    }
    else if (cS === 1) {
      output.push("$");
      output.push(s.charAt(i));
      cS = 0;
    } else {
      output.push(s.charAt(i));
    }

  }
  return output.join("");
}

function DescBlock({ id, head, body, type, ...other }) {
  const theme = useTheme();
  const consolasTheme = createTheme({
    typography: {
      fontFamily: 'Consolas',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Consolas';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: "local('Consolas'), local('Consolas-Regular'), url(${Consolas}) format('ttf')";
          unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
        }
        `
      }
    }
  });
  // const nbody = wrapMathJax(body);
  // console.log(nbody);
  const c = type === 'copy' ?
  <ThemeProvider theme={consolasTheme}>
    <CssBaseline />
    <CopyBlock
      text={body}
      language="html"
      showLineNumbers="true"
      theme={theme}
      sx={{
        fontFamily: 'Consolas',
      }}
      codeBlock
    />
    {/* <TextField
      id="outlined-multiline-flexible"
      label="Multiline"
      multiline
      value={body}
      sx={{
        fontFamily: 'Consolas',
      }}
    /> */}
  </ThemeProvider>
    // <AceEditor
    //   value={body}
    //   mode="plain_text"
    //   showLineNumbers="true"
    //   readOnly="true"
    //   theme="github"
    //   fontSize={20}
    // />
     :
    <ReactMarkdown
      children={wrapMathJax(body)}
      rehypePlugins={[
        rehypeMathjax,
        // rehypeKatex,
        rehypeRaw,
        rehypeStringify
      ]}
      remarkPlugins={[
        remarkGfm,
        remarkMath,
        remarkParse,
        remarkRehype
      ]} 
      transformLinkUri={uriTransformerForOss}
      transformImageUri={uriTransformerForOss}
      />;
  return (
    <Grid item xs={type==='copy'?6:12} key={id}>
      <Card {...other}>
        <CardHeader title={head} subheader="" />

        <CardContent>
          {c}


        </CardContent>
      </Card>
    </Grid>
  );
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

  const [selected, setSelected] = useState('default');

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    // console.log(event);
  };

  const handleClose = (event) => {
    setOpen(null);
    // console.log('close', event);
  };


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
      axios.get(U(`/problem/${problemId}`), { withCredentials: true }).then(resp => {
        // console.log(resp);
        // resp.data.desc=resp.data.desc.replaceAll('\\n', '\n');
        // console.log(resp.data.desc.replaceAll('\\n', '  \\n'));
        console.log(resp.data.desc);
        // console.log(Object.keys(resp.data.desc));
        // const li = [];
        // resp.data.desc.keys().map(
        // (i)=>li.push(i)
        // );
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

  useEffect(getProblem);



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
            <>
              <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
                {LOCALIZATIONPACK.problem.showingLang}:&nbsp;
                <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {langMap[selected]}
                </Typography>
              </Button>
              <Menu
                keepMounted
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {lang.map((option) => (
                  <MenuItem
                    key={option}
                    selected={option === selected}
                    onClick={() => {
                      setSelected(option);
                      handleClose();
                    }}
                    sx={{ typography: 'body2' }}
                  >
                    {langMap[option]}
                  </MenuItem>
                ))}
              </Menu>
            </>
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          {problemData.desc[selected].map((it, index) =>
            (<DescBlock key={index} id={index} head={it.head} body={it.body} type={it.type} />)
          )}
        </Grid>

      </Container>
    </Page>
  );
}
