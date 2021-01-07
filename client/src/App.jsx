import { Box, Button, Container, createMuiTheme, ThemeProvider, Typography } from '@material-ui/core';
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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9900',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#4a4f52',
    }
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <YMaps>
          <ToastContainer />
          <Box bgcolor="#E5E5E5">
            <Container maxWidth="sm">
              <Box bgcolor="white" minHeight="100vh" position="relative">
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/makeorder" />
                    </Route>
                    <Route exact path="/makeorder" component={MakeOrder} />
                    <Route exact path="/order/:id" component={OrderPage} />
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register} />
                    <ProtectedRoute exact path="/myorders" component={MyOrders} />
                  </Switch>
                  <BottomMenu />
                </Router>
              </Box>
            </Container>
          </Box>
        </YMaps>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
