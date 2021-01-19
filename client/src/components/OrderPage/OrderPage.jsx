import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { fetchOrder, droneAction } from '../../utils/api';
import { formattedDistance, statusToText, tariffToText } from '../../utils/display';
import HeaderMenu from '../shared/HeaderMenu';
import LoadingSpinner from '../shared/LoadingSpinner';
import DroneLocation from './DroneLocation';

const useStyles = makeStyles(theme => ({
    root: {},
    location: {
        marginTop: '20px',
    },
    info: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    total: {
        marginTop: theme.spacing(2),
    },
}))

const OrderPage = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const getOrder = async () => {
            const order = await fetchOrder(id);
            setOrder(order);
            setLoading(false);
        }
        if (loading) getOrder();
    }, [loading]);

    console.log(order);

    if (loading) return (
        <LoadingSpinner />
    )
    if (!order) return (
        <Redirect to="/" />
    )

    const info = [
        {
            label: 'Старт',
            value: order.placeFrom.name,
        },
        {
            label: 'Финиш',
            value: order.placeTo.name,
        },
        {
            label: 'Расстояние',
            value: formattedDistance(order.distance),
        },
        {
            label: `Тариф "${tariffToText[order.tariff.toString()]}"`,
            value: `${order.tariff} ₽/км`,
        },
        {
            label: `Статус доставки`,
            value: `${statusToText[order.state].text}`,
            color: `${statusToText[order.state].color}`,
        }
    ]


    return (
        <React.Fragment>
            <HeaderMenu text={'Заказ'}/>
            <DroneLocation pos={order.drone.pos}/>
            <Grid container spacing={2} direction="column" alignItems="center"
            className={classes.info}>
                {info.map(inf => 
                    <Grid item container justify="space-between"
                    alignItems="flex-end" xs={10}>
                        <Grid item>
                            <Typography variant="h3">{inf.label} </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4"
                            style={{ color: inf.color, fontWeight: inf.color && 'bold' }}>
                                {inf.value}
                            </Typography>
                        </Grid>
                    </Grid>)}
                <Grid item container justify="space-between" xs={10} className={classes.total}>
                    <Grid item>
                        <Typography variant="h2">Сумма доставки</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h2">{order.price} ₽</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default OrderPage
