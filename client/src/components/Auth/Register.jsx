import { Button, Grid, makeStyles, TextField } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../../contexts/UserContext'
import { emailRe } from '../../utils/api'
import HeaderMenu from '../shared/HeaderMenu'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: '20px',
        width: '100%',
    },
    input: {
         "&::placeholder": {
        color: "gray"
      },
    },
}))

const Register = () => {
    const { register, reload } = useContext(UserContext);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const history = useHistory();
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const registerAction = async () => {
        // const token = await executeRecaptcha('register');
        // if (token) setSubmitting(true);
        setSubmitting(true);
    }

    useEffect(() => {
        const submit = async () => {
            if (password !== password2) {
                toast.error('Пароли не совпадают');
                return setSubmitting(false);
            }
            if (!emailRe.test(username)) {
                toast.error('Некорректный Email');
                return setSubmitting(false);
            }
            const success = await register({ username, password });
            if (success) {
                reload();
                return history.push('/');
            }
            setSubmitting(false);
        }
        if (submitting) submit();
    }, [submitting]);

    return (
        <React.Fragment>
            <HeaderMenu text={'Регистрация'}/>
            <GoogleReCaptcha />
            <Grid container spacing={2} direction="column" alignItems="center"
            className={classes.container}>
                <Grid item>
                    <img src="/authDrone.png"/>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <TextField label="Логин (Email)" variant="outlined" size="small"
                        fullWidth value={username}
                        onChange={e => setUsername(e.target.value)}/>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <TextField label="Пароль" variant="outlined" type="password" size="small"
                        fullWidth value={password} onChange={e => setPassword(e.target.value)}/>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <TextField label="Подтверждение пароля" variant="outlined" type="password" 
                        size="small" fullWidth value={password2} 
                        onChange={e => setPassword2(e.target.value)}/>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <Button variant="contained" color="primary" fullWidth
                        onClick={registerAction}>
                            Зарегистрироваться
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container justify="center">
                    <Grid item xs={11}>
                        <Button variant="text" color="default" fullWidth size="small"
                        href="/login">
                            Логин
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Register
