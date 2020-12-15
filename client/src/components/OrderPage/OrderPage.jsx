import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { fetchOrder } from '../../utils/api';
import HeaderMenu from '../shared/HeaderMenu';
import LoadingSpinner from '../shared/LoadingSpinner';

const useStyles = makeStyles(theme => ({
    root: {},
}))

const statusToText = {
    "not-started": "Ещё не началась",
    "in-progress": "В процессе",
    "completed": "Доставлена",
}

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
    return (
        <React.Fragment>
            <HeaderMenu text={'Заказ'}/>
            <Paper elevation={5} placeholder="Информация о заказе" className={classes.root}>
                <Box padding={'15px'} className="order-info-box">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Typography variant="h2">Информация о заказе</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">
                                {order.placeFrom.name} {'==>'} {order.placeTo.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">Расстояние: {order.distance}km</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">Цена: {order.price}руб</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">
                                Статус доставки: {statusToText[order.state]}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </React.Fragment>
    )
}

export default OrderPage
