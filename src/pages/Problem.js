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

// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Stack, Card } from '@mui/material';
// components
import Page from '../components/Page';
import U from '../api/urls';
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

// ----------------------------------------------------------------------

// function MarkdownRender(props) {
//   const newProps = {
//       ...props,
//       remarkPlugins: [
//         RemarkMathPlugin,
//         remarkGfm,
//         rehypeRaw
//       ],
//       renderers: {
//         ...props.renderers,
//         math: (props) => 
//           <MathJax.Node formula={props.value} />,
//         inlineMath: (props) =>
//           <MathJax.Node inline formula={props.value} />
//       }
//     };
//     return (
//       <MathJax.Provider input="tex">
//           <ReactMarkdown {...newProps} />
//       </MathJax.Provider>
//     );
// }


export default function Problem() {
  const {problemId} = useParams();

  const navigate = useNavigate();

  const [shouldRequest, setShouldRequest] = useState(true);

  const [problemData, setProblemData] = useState(
    {
      // title: 'Loading ...',
      // desc: '',
      // desc_type: 'M',
      // memory_limit: 0,
      // time_limit: 0,
      // submitted: 0,
      // solved: 0,
      // solution_handle: null,
      code: "Loading...",
      date: "2017-02-09T19:32:32",
      desc: "",
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
      title: "UC Browser",
      types: [],
    }
  );

  const getProblem = () => {
    if(shouldRequest)
    {
      setShouldRequest(false);
      axios.get(U(`/problem/${problemId}`), {withCredentials: true}).then(resp => {
        console.log(resp);
        // resp.data.desc=resp.data.desc.replaceAll('\\n', '\n');
        // console.log(resp.data.desc.replaceAll('\\n', '  \\n'));
        console.log(resp.data.desc);
        setProblemData(resp.data);
      }).catch(reason=>{
        console.log(reason.response);
        if(reason.response.status===404)
        {
          navigate('/404', {replace: true});
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
        <Card>
          <ReactMarkdown 
          children={problemData.desc} 
          rehypePlugins={[
            rehypeMathjax,
            rehypeRaw
          ]}
          remarkPlugins={[
            remarkGfm,
            remarkMath,
          ]}/>
          {/* <ReactMarkdown>

          {problemData.desc.replaceAll('\\n', '  \\n')}
          </ReactMarkdown> */}

        </Card>

      </Container>
    </Page>
  );
}
