import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeMathjax from 'rehype-mathjax'
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import ReactMarkdown from 'react-markdown';

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

// eslint-disable-next-line import/no-named-default
import { ossUrl } from '../../api/urls';
import LOCALIZATIONPACK from '../../localization/str';

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
        if (li[0] === '' && li[1] === 'oss' && li[2].length === 24)
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

export default function CommonDescBlock({ id, head, body, ...other }) {
    return (
        <Grid item xs={12} key={id}>
            <Card {...other}>
                <CardHeader 
                titleTypographyProps={{variant:'h4' }}
                subheaderTypographyProps={{variant:'subtitle1'}}
                
                title={LOCALIZATIONPACK.problem.blocks[head] || head} subheader={head} />
                <CardContent>
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
                    />
                </CardContent>
            </Card>
        </Grid>
    );
}
