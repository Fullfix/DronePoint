import { Box, Button, Container, createMuiTheme, makeStyles, ThemeProvider, Typography } from '@material-ui/core';
import { YMaps } from 'react-yandex-maps';
import './App.css';
import UserProvider from './contexts/UserContext';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import MakeOrder from './components/MakeOrder';
import OrderPage from './components/OrderPage';
import ProtectedRoute from './routes/ProtectedRoute';
import MyOrders from './components/MyOrders/MyOrders';
import Login from './components/Auth/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomMenu from './components/shared/BottomMenu';
import Register from './components/Auth/Register';
import { YMInitializer } from 'react-yandex-metrika';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import useWindowSize from './hooks/useWindowSize'
import { Helmet } from 'react-helmet';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import About from './components/About';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import Payment from './components/Payment';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9900',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#4a4f52',
    },
  },
  typography: {
    fontFamily: [
      "'Inter'",
    ].join(','),
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 18,
    },
    h4: {
      fontSize: 16,
    },
    h5: {
      fontSize: 14,
    },
    h6: {
      fontSize: 12,
    }
  }
})

const useStyles = makeStyles(theme => ({
  box: {
    overflowY: 'scroll', 
    overflowX: 'hidden',
    position: 'fixed',
    width: theme.breakpoints.width('sm'),
    [theme.breakpoints.down('xs')]: {
        width: '100%',
    }
  }
}))

function App() {
  const size = useWindowSize();
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <YMaps>
          <GoogleReCaptchaProvider 
          reCaptchaKey="6LeKOFIaAAAAAIf3BdoZJdGB_HbHt4ewbIu6pg-H"
          language="RU">
            <ToastContainer />
            <YMInitializer accounts={[72212146]} />
            <Helmet>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content={theme.palette.primary.main} />
            <meta name="yandex-verification" content="01444705e57ff800" />
            <meta
              name="description"
              content="Приложение для доставки дронами"
            />
            <link rel="icon" href="/favicon.svg" />
            <title>DeliDrone</title>
            <link rel="apple-touch-icon" href="/favicon.svg" />
            <link rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            </Helmet>
            <Box bgcolor="#E5E5E5" style={{ overflow: 'hidden' }}>
              <Container maxWidth="sm" style={{ padding: 0, overflow: 'hidden' }}>
                <Box bgcolor="white" height="100vh">
                  <Router>
                    <Box className={classes.box} style={{
                      height: size.height - 56,
                    }}>
                      <Switch>
                        <Route exact path="/">
                          <Redirect to="/makeorder" />
                        </Route>
                        <Route exact path="/makeorder" component={MakeOrder} />
                        <Route exact path="/order/:id" component={OrderPage} />
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/verify-email/:id/:code" component={VerifyEmail} />
                        <ProtectedRoute exact path="/myorders" component={MyOrders} />
                        <ProtectedRoute exact path="/menu" component={Menu} />
                        <ProtectedRoute exact path="/profile" component={Profile} />
                        <ProtectedRoute exact path="/about" component={About} />
                      </Switch>
                    </Box>
                    <BottomMenu />
                  </Router>
                </Box>
              </Container>
            </Box>
          </GoogleReCaptchaProvider>
        </YMaps>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
