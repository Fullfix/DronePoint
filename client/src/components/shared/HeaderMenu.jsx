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
    img: {
        height: '100%',
        marginRight: '20px',
    },
    user: {
        height: '44px',
        width: '44px',
        position: 'absolute',
        right: 10,
    },
    userIcon: {
        height: '44px',
        width: '44px',
        color: 'white',
    }
}))

const HeaderMenu = ({ text }) => {
    const classes = useStyles();
    const { isAuthenticated, logout } = useContext(UserContext);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
        history.push('/login');
    }

    return (
        <React.Fragment>
            <AppBar className={classes.appbar}>
                <Toolbar>
                    <Box display="flex" className={classes.root} alignItems="center">
                        <img src={"/favicon.svg"} className={classes.img}/>
                        <Typography variant="h2">{text}</Typography>
                        {isAuthenticated && <React.Fragment>
                            <IconButton className={classes.user}
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <AccountCircle className={classes.userIcon}/>
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
