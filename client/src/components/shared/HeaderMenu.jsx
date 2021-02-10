import React, { useContext } from 'react';
import { AppBar, Box, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { UserContext } from '../../contexts/UserContext';

const useStyles = makeStyles(theme => ({
    root: {
        height: '64px',
        [theme.breakpoints.down('sm')]: {
            height: '56px',
        }
    },
    img: {
        height: '100%',
        marginRight: '20px',
    },
    user: {
        height: '44px',
        width: '44px',
        position: 'absolute',
        right: 10,
    }
}))

const HeaderMenu = ({ text }) => {
    const classes = useStyles();
    const { isAuthenticated } = useContext(UserContext);
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box display="flex" className={classes.root} alignItems="center">
                    <img src={"/logo.svg"} className={classes.img}/>
                    <Typography variant="h2">{text}</Typography>
                    {isAuthenticated && <AccountCircle className={classes.user}/>}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderMenu;
