import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material';


const USER_DISPLAY_CODES = {
    'AC': 'Accepted',
    'WA': 'Wrong Answer',
    'SC': 'Short Circuited',
    'TLE': 'Time Limit Exceeded',
    'MLE': 'Memory Limit Exceeded',
    'OLE': 'Output Limit Exceeded',
    'IR': 'Invalid Return',
    'RTE': 'Runtime Error',
    'CE': 'Compile Error',
    'IE': 'Internal Error (judging server error)',
    'QU': 'Queued',
    'P': 'Processing',
    'G': 'Grading',
    'D': 'Completed',
    'AB': 'Aborted',
}

// STATUS = (
//     ('QU', 'Queued'),
//     ('P', 'Processing'),
//     ('G', 'Grading'),
//     ('D', 'Completed'),
//     ('IE', 'Internal Error'),
//     ('CE', 'Compile Error'),
//     ('AB', 'Aborted'),
// )

export default function CaseBlock({pk, result, time, memory, ...others}) {
  return (
    <Grid item xs={3} key={pk}>
        <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
            <CardMedia
            component="img"
            height="140"
            image={`/static/results/${result}.png`}
            alt="green iguana"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                #{pk}&nbsp;{USER_DISPLAY_CODES[result]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {Math.round(time*1000)}ms/{memory}kb
            </Typography>
            </CardContent>
        </CardActionArea>
        {/* <CardActions>
            <Button size="small" color="primary">
            ...
            </Button>
        </CardActions> */}
        </Card>
    </Grid>
  );
}