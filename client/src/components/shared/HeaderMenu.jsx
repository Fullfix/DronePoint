import React, { useContext, useState } from 'react';
import { AppBar, Box, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    appbar: {
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: theme.breakpoints.width('sm'),
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        }
    },
    root: {
        height: '64px',
        [theme.breakpoints.down('sm')]: {
            height: '56px',
        }
    },
    text: {
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px',
        },
    },
    img: {
        height: '100%',
        marginRight: '20px',
        cursor: 'pointer',
        [theme.breakpoints.down('xs')]: {
            marginRight: '10px',
        }
    },
    user: {
        height: '55px',
        width: '55px',
        position: 'absolute',
        // backgroundColor: '#333333',
        border: 'none',
        right: 10,
    },
    userIcon: {
        height: '55px',
        width: '55px',
        color: 'white',
    },
}))

const HeaderMenu = ({ text }) => {
    const classes = useStyles();
    const { isAuthenticated, logout, user } = useContext(UserContext);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
        history.push('/login');
    }

    const handleLogo = () => {
        history.push('/makeorder');
    }

    return (
        <React.Fragment>
            <AppBar className={classes.appbar}>
                <Toolbar>
                    <Box display="flex" className={classes.root} alignItems="center">
                        <img src={"/favicon.svg"} className={classes.img}
                        onClick={handleLogo}/>
                        <Typography variant="h2"
                        className={classes.text}>{text}</Typography>
                        {isAuthenticated && <React.Fragment>
                            <IconButton className={classes.user}
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <img src={`/icons/${user.icon}.svg`} 
                                className={classes.userIcon}/>
                            </IconButton>
                            <Menu id="user-menu" keepMounted
                            anchorEl={anchorEl}
                            open={!!anchorEl}
                            onClose={() => setAnchorEl(null)}>
                                <MenuItem>Профиль</MenuItem>
                                <MenuItem onClick={handleLogout}
                                >Выйти из аккаунта</MenuItem>
                            </Menu>
                        </React.Fragment>}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className={classes.root}></Box>
        </React.Fragment>
    )
}

export default HeaderMenu;
