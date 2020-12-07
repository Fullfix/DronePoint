import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';

function calcCrow([lat1, lon1], [lat2, lon2]) {
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(value) {
    return value * Math.PI / 180;
}

const OrderDetails = ({ placeTo, placeFrom, onSubmit }) => {
    if (!placeFrom || !placeTo) {
        return (
            <Typography variant="h3" align="center">
                Выберите место отправления и досавки, чтобы оформить заказ
            </Typography>
        )
    }
    const distance = calcCrow(placeFrom.pos, placeTo.pos).toFixed(2);
    const time = 100;
    const price = 100;
    return (
        <React.Fragment>
            <Grid item>
                <Paper elevation={5} placeholder="Информация о заказе">
                    <Box width="380px" padding={'15px'}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <Typography variant="h2">Информация о заказе</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3">
                                    {placeFrom.name} {'==>'} {placeTo.name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3">Расстояние: {distance}km</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3">Время: {time}мин</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3">Цена: {price}руб</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
            <Grid item>
                <Box width="300px">
                    <Button variant="contained" color="primary" fullWidth style={{
                        textTransform: 'none',
                    }}>
                        <Typography variant="h3">Заказать</Typography>
                    </Button>
                </Box>
            </Grid>
        </React.Fragment>
    )
}

export default OrderDetails;
