import { useState } from 'react';

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
import Iconify from './Iconify';
// {pk:"...", label:"...."}
export default function DropdownMenu({hint, itemList, selected, setSelected, ...others}) {

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
            >
                {hint}:&nbsp;
            <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {selected===undefined?"":selected.label}
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
                {itemList.map((option, index) => (
                    <MenuItem
                        key={index}
                        selected={option === selected}
                        onClick={() => {
                            setSelected(option);
                            handleClose();
                        }}
                        sx={{ typography: 'body2' }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}