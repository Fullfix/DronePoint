import React, { forwardRef, useEffect, useState } from 'react';
import { Map, Placemark } from 'react-yandex-maps';
import { AppBar, Box, Dialog, IconButton, List, ListItem, 
    ListItemIcon, Slide, Toolbar, Typography, ListItemText, Grid, Button } from '@material-ui/core';
import { Close as CloseIcon, LocationOn } from '@material-ui/icons';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DroneMap = ({ open, onClose, onSelect }) => {
    const [dronePoints, setDronePoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [coords, setCoords] = useState([55.75, 37.57]);

    useEffect(() => {
        const fetchDronePoints = async () => {
            const res = await axios.get(`/dronepoint/all`);
            setDronePoints(res.data.response);
            setLoading(false);
        }
        if (loading) fetchDronePoints();
    }, [loading])

    return (
        <Dialog fullScreen open={!!open} onClose={onClose}
        TransitionComponent={Transition}>
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}
                    aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h2">
                        Выберите Дрон-пойнт ({ open === 'from' ? 'откуда' : 'куда'})
                    </Typography>
                </Toolbar>
            </AppBar>
            {loading && <LoadingSpinner height={'800px'}/>}
            {!loading && <Grid container direction="column">
                <Grid item>
                    <Map state={{ center: coords, zoom: 9 }}
                    className="yandex-map"
                    width="100%" height="67vh">
                        {dronePoints.map(point => 
                        <Placemark key={point.name} geometry={point.pos}
                        options={{ iconColor: point.name === selectedPoint ? 'red' : 'blue' }}/>)}
                    </Map>
                </Grid>
                <Grid item>
                    <List component="nav" style={{ height: '20vh', overflow: 'auto' }}>
                        {dronePoints.map(point => 
                        <ListItem button selected={point.name === selectedPoint}
                        key={point.name}
                        onClick={() => {
                            setSelectedPoint(p => p === point.name ? null : point.name);
                            setCoords(point.pos);
                        }}>
                            <ListItemIcon>
                                <LocationOn color={point.name === selectedPoint ? 
                                'secondary' : 'inherit'}/>
                            </ListItemIcon>
                            <ListItemText primary={point.name}/>
                        </ListItem>)}
                    </List>
                </Grid>
            </Grid>}
            <Button fullWidth variant="contained" color="primary"
            disabled={!selectedPoint}
            style={{ position: 'relative', bottom: 0 }}
            onClick={() => {
                const point = dronePoints.find(p => p.name === selectedPoint);
                onSelect(point, open);
                onClose();
                setSelectedPoint(null);
            }}>Выбрать</Button>
        </Dialog>
    )
}

export default DroneMap
