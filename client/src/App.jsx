import { Box, Button, Container, createMuiTheme, ThemeProvider, Typography } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import { YMaps } from 'react-yandex-maps';
import './App.css';
import MakeOrder from './components/MakeOrder';
import UserProvider from './contexts/UserContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF9900',
      contrastText: '#FFFFFF',
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
              <Box bgcolor="white">
                <MakeOrder />
              </Box>
            </Container>
          </Box>
        </YMaps>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
