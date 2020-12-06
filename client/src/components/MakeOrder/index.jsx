import { Box, Button, Grid, Input, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import DroneMap from '../shared/DroneMap';
import HeaderMenu from '../shared/HeaderMenu';

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

const MakeOrder = () => {
    const [placeFrom, setPlaceFrom] = useState(null);
    const [placeTo, setPlaceTo] = useState(null);
    const [mapOpen, setMapOpen] = useState(false);
    const distance = placeFrom && placeTo && calcCrow(placeFrom.pos, placeTo.pos).toFixed(2);
    return (
        <React.Fragment>
            <DroneMap open={mapOpen} onClose={() => setMapOpen(false)}
            onSelect={(point, type) => {
                if (type === 'from') {
                    setPlaceFrom(point);
                } else {
                    setPlaceTo(point);
                }
            }}/>
            <HeaderMenu text={"Оформить заказ"}/>
            <Box height="90vh" padding="30px" position="relative">
                <Grid container alignItems="center" direction="column"
                spacing={3}>
                    <Grid item>
                        <Box width="300px">
                            <Typography variant="h3">Маршрут</Typography>
                            <Button variant="text" fullWidth 
                            onClick={e => setMapOpen('from')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeFrom?.name || 'Откуда'}
                            </Button>
                            <Button variant="text" fullWidth 
                            onClick={e => setMapOpen('to')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeTo?.name || 'Куда'}
                            </Button>
                            <Typography align="right" style={{ marginTop: 10 }}>
                                {distance || '-'}km
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth
                            style={{ marginTop: 10, textTransform: 'none' }}>
                                Отправить
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default MakeOrder
