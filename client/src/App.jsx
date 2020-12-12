import { Box, Button, Container, createMuiTheme, ThemeProvider, Typography } from '@material-ui/core';
import { YMaps } from 'react-yandex-maps';
import './App.css';
import UserProvider from './contexts/UserContext';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import MakeOrder from './components/MakeOrder';
import OrderPage from './components/OrderPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9900',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#33AFFF',
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
      fontSize: 12,
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <YMaps>
          <Box bgcolor="#E5E5E5">
            <Container maxWidth="sm">
              <Box bgcolor="white" minHeight="100vh">
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/makeorder" />
                    </Route>
                    <Route exact path="/makeorder" component={MakeOrder} />
                    <Route exact path="/order/:id" component={OrderPage} />
                  </Switch>
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
