import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';

const HeaderMenu = ({ text }) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box width="100%" height="100%" justifyContent="center" display="flex">
                    <Typography variant="h2">{text}</Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderMenu;
