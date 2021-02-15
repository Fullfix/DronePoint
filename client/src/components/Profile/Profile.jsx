import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import HeaderMenu from '../shared/HeaderMenu'

const useStyles = makeStyles(theme => ({
    list: {
        padding: '20px',
        marginTop: '10px',
    },
    password: {
        backgroundColor: '#696969',
    },
    logout: {

    },

}))

const Profile = () => {
    const { user, logout } = useContext(UserContext);
    const history = useHistory();
    const classes = useStyles();
    return (
        <React.Fragment>
            <HeaderMenu text={'Профиль'} />
            <Grid container spacing={2} className={classes.list}
            direction="column">
                <Grid item>
                    <Typography variant="h3">
                        Email: {user.email}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">
                        Сменить Пароль
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" className={classes.logout}
                    color="secondary" onClick={() => {
                        logout();
                        history.push('/login');
                    }}>
                        Выйти из аккаунта
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Profile
