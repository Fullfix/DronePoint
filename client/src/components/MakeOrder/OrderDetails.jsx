import { Box, Button, Checkbox, Container, Grid, Link, makeStyles, Paper, Radio, RadioGroup, Typography, useMediaQuery } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import React, { useState } from 'react';
import { formattedTime } from '../../utils/display';

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

const useStyles = makeStyles(theme => ({
    info: {
        width: 330,
    },
    tarif: {
        marginTop: 20,
    },
    radio: {
        marginTop: -4,
    },
    tarifLabel: {
        marginBottom: 15,
    }
}))


const OrderDetails = ({ placeTo, placeFrom, onSubmit, order }) => {
    const classes = useStyles();
    const [tariff, setTariff] = useState(100);

    if (!placeFrom || !placeTo) {
        return (
            <Typography variant="h3" align="center">
                Выберите место отправления и доставки, чтобы оформить заказ
            </Typography>
        )
    }

    const distance = calcCrow(placeFrom.pos, placeTo.pos).toFixed(2);
    const droneVelocity = 5;
    console.log(tariff);
    const info = [
        {
            label: 'Старт',
            value: placeFrom.name,
        },
        {
            label: 'Финиш',
            value: placeTo.name,
        },
        {
            label: 'Расстояние',
            value: `${parseInt(distance)} км`,
        },
        {
            label: 'Время доставки',
            value: formattedTime(distance * 1000 / droneVelocity),
        },
    ]
    const tariffes = [
        { label: 'Обычный', value: 100 },
        { label: 'Быстрый', value: 150 },
        { label: 'По подписке', value: 69 },
    ]

    return (
        <React.Fragment>
            <Grid item container spacing={2} direction="column" className={classes.info}>
                {info.map(inf => 
                <Grid item container justify="space-between"
                alignItems="flex-end">
                    <Grid item>
                        <Typography variant="h3">{inf.label} </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">{inf.value}</Typography>
                    </Grid>
                </Grid>)}
                <Grid item className={classes.tarif}>
                    <Typography variant="h3" 
                    className={classes.tarifLabel}>Выбор тарифа</Typography>
                    <Grid container spacing={1} direction="column">
                        {tariffes.map(tarif => 
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h4" component="span">
                                    <Radio color="primary" className={classes.radio}
                                    checked={tariff === tarif.value}
                                    onChange={() => setTariff(tarif.value)}/>
                                    {tarif.label} ({tarif.value} ₽/км)
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Info />
                            </Grid>
                        </Grid>)}
                    </Grid>
                </Grid>
                <Grid item container justify="space-between">
                    <Grid item>
                        <Typography variant="h2">Сумма доставки</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h2">{parseInt(distance * tariff)} ₽</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                {!order && <Box width="300px">
                    <Button variant="contained" color="primary" fullWidth style={{
                        textTransform: 'none',
                    }} onClick={() => onSubmit(distance, parseInt(distance * tariff))}>
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
                                        {`${window.location.hostname}/order/${order._id}`}
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
