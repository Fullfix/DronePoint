import { Box, Button, Grid, Input, makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import DroneMap from '../shared/DroneMap';
import HeaderMenu from '../shared/HeaderMenu';
import OrderDetails from './OrderDetails';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import './MakeOrder.css';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { getAllDronepoints, getApproxTimeLeft } from '../../utils/api';

const useStyles = makeStyles(theme => ({
    box: {
        width: theme.breakpoints.width('sm') - 50,
        [theme.breakpoints.down('xs')]: {
            width: '90%',
        }
    },
}))

const MakeOrder = () => {
    const [placeFrom, setPlaceFrom] = useState(null);
    const [placeTo, setPlaceTo] = useState(null);
    const [mapOpen, setMapOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const { isAuthenticated, logout } = useContext(UserContext);
    const [distance, setDistance] = useState(null);
    const [dronePoints, setDronePoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [price, setPrice] = useState(null);
    const [tariff, setTariff] = useState(null);
    const [comment, setComment] = useState(null);
    const [time, setTime] = useState(null);
    const placeRef = useRef();
    const classes = useStyles();
    // logout()

    useEffect(() => {
        const fetchTime = async () => {
            if (!placeFrom || !placeTo) {
                setTime(null);
                setDistance(null);
                return;
            }
            const { success, res } = await getApproxTimeLeft(placeFrom._id, placeTo._id);
            setTime(res.time);
            setDistance(res.distance);
        }
        fetchTime();
    }, [placeFrom, placeTo]);

    useEffect(() => {
        const fetchDP = async () => {
            const { success, res } = await getAllDronepoints();
            setDronePoints(res);
            setLoading(false);
        }
        if (loading) fetchDP();
    })

    useEffect(() => {
        const makeOrder = async () => {
            if (!placeTo && !placeFrom) {
                toast.warn('Выберите Дронпоинты для доставки');
                return setIsOrdering(false);
            }
            try {
                const res = await axios.post(`/api/order/create/${isAuthenticated ? 'auth' : 'guest'}`, {
                    placeFrom: placeFrom._id,
                    placeTo: placeTo._id,
                    tariff,
                    name: comment,
                });
                setOrder(res.data.response);
            } catch(err) {
                console.log(err);
            }
            setIsOrdering(false);
            setPrice(null);
            setDistance(null);
        }
        if (isOrdering) makeOrder();
    }, [isOrdering, placeFrom, placeTo, distance, price]);

    useEffect(() => {
        if (order) {
            const interval = setInterval(() => {
                const obj = document.querySelector('#order-find-btn');
                if (obj) {
                    obj.scrollIntoView();
                    clearInterval(interval);
                }
            }, 200);
        }
    }, [order]);

    if (isOrdering || loading) return (
        <LoadingSpinner height="100vh"/>
    )

    return (
        <React.Fragment>
            <DroneMap open={mapOpen} onClose={() => setMapOpen(false)}
            dronePoints={dronePoints} loading={loading}
            placeFrom={placeFrom}
            onSelect={(point, type) => {
                if (type === 'from') {
                    setPlaceFrom(point);
                    setPlaceTo(null);
                } else {
                    setPlaceTo(point);
                }
            }}/>
            <HeaderMenu text={"Оформление заказа"}/>
            <Box position="relative"
            className="main-box"
            width="100wv">
                <Grid container alignItems="center" direction="column"
                spacing={3}>
                    <Grid item className={clsx(classes.box)} id="placeBox">
                        <Box width="100%">
                            <Typography variant="h3">Маршрут</Typography>
                            <Button variant="text" fullWidth 
                            disabled={!!order}
                            onClick={e => setMapOpen('from')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeFrom?.name || 'Откуда'}
                            </Button>
                            <Button variant="text" fullWidth
                            disabled={!!order || !placeFrom}
                            onClick={e => setMapOpen('to')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeTo?.name || 'Куда'}
                            </Button>
                        </Box>
                    </Grid>
                    <OrderDetails placeFrom={placeFrom} placeTo={placeTo}
                    order={order} distance={distance} time={time}
                    onSubmit={(pr, tf, cm) => {
                        setPrice(pr);
                        setIsOrdering(true);
                        setTariff(tf);
                        setComment(cm !== '' ? cm : null);
                    }}/>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default MakeOrder
