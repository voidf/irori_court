import { useTheme, createTheme } from '@mui/material/styles';
import { CopyBlock, dracula } from "react-code-blocks";

import {
    Card,
    Menu,
    MenuItem,
    CardHeader,
    CardContent,
    Grid,
    CssBaseline,
    ThemeProvider
} from '@mui/material';
import Consolas from '../../assets/ConsolasHybrid1.12.ttf'
import LOCALIZATIONPACK from '../../localization/str';

export default function SampleBlock({ id, head, body, ...other }) {
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
    return (
        <Grid item xs={6} key={id}>
            <Card {...other}>
                <CardHeader titleTypographyProps={{ variant: 'h4' }}
                    subheaderTypographyProps={{ variant: 'subtitle1' }}
                    title={LOCALIZATIONPACK.problem.blocks[head] || head} subheader={head} />
                <CardContent>
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
                    </ThemeProvider>
                </CardContent>
            </Card>
        </Grid>
    );
}