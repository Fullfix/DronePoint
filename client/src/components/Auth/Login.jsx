import { Button, Grid, makeStyles, TextField } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../../contexts/UserContext'
import HeaderMenu from '../shared/HeaderMenu'
import LoadingSpinner from '../shared/LoadingSpinner'

const useStyles = makeStyles({
    container: {
        width: '100%',
        marginTop: 20,
    },
    input: {
         "&::placeholder": {
        color: "gray"
      },
    }
})

const Login = () => {
    const { login } = useContext(UserContext);
    const history = useHistory();
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const loginBtn = useRef();

    useEffect(() => {
        document.onkeypress = e => {
            if (e.code === 'Enter') {
                loginBtn.current.click();
            }
        }
    }, []);
    useEffect(() => {
        const submit = async () => {
            const success = await login({ username, password });
            if (success) {
                return history.push('/');
            }
            setSubmitting(false);
            toast.error('Неверный логин или пароль');
        }
        if (submitting) submit();
    }, [submitting]);
    if (submitting) return (
        <LoadingSpinner />
    )
    return (
        <React.Fragment>
            <HeaderMenu text={'Авторизация'}/>
            <Grid container spacing={2} direction="column"
            alignItems="center" className={classes.container}>
                <Grid item>
                    <img src="/authDrone.png"/>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <TextField label="Логин (Email)" variant="outlined" 
                        type="email"
                        size="small"
                        autoComplete="email"
                        fullWidth value={username} onChange={e => setUsername(e.target.value)}/>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <TextField label="Пароль" variant="outlined" type="password" size="small"
                        autoComplete="password"
                        fullWidth value={password} onChange={e => setPassword(e.target.value)}/>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <Button variant="contained" color="primary" fullWidth
                        onClick={e => setSubmitting(true)} ref={loginBtn}>
                            Войти
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <Button variant="text" color="default" fullWidth size="small">
                            Забыли пароль
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <Button variant="text" color="default" fullWidth size="small"
                        href="/register">
                            Зарегистрироваться
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Login
