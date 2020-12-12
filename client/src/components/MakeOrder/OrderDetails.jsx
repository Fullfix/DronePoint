import { Box, Button, Container, Grid, Link, Paper, Typography, useMediaQuery } from '@material-ui/core';
import React from 'react';
import { CLIENT_URL } from '../../utils/api';

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

const OrderDetails = ({ placeTo, placeFrom, onSubmit, order }) => {
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
                    <Box padding={'15px'} className="order-info-box">
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
                {!order && <Box width="300px">
                    <Button variant="contained" color="primary" fullWidth style={{
                        textTransform: 'none',
                    }} onClick={onSubmit}>
                        <Typography variant="h3">Заказать</Typography>
                    </Button>
                </Box>}
                {order && <Box className="order-link">
                    <Typography variant="h2" align="center">Заказ оформлен</Typography>
                    <Grid container justify="center">
                        <Grid item xs={10} sm={10}>
                            <Box border="2px solid black" padding={1} marginTop={1}>
                                <Link href={`/order/${order._id}`} color="secondary">
                                    <Typography style={{ wordWrap: 'break-word' }}>
                                        {`${CLIENT_URL}/order/${order._id}`}
                                    </Typography>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginTop={2}>
                        <Grid container justify="center">
                            <Grid item>
                                <Button href={`/order/${order._id}`} variant={'contained'}
                                color="primary">
                                    Перейти к отслеживанию
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>}
            </Grid>
        </React.Fragment>
    )
}

export default OrderDetails;
