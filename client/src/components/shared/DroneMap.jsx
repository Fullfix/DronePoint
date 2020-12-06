import React, { forwardRef, useState } from 'react';
import { Map, Placemark } from 'react-yandex-maps';
import { AppBar, Box, Dialog, IconButton, List, ListItem, 
    ListItemIcon, Slide, Toolbar, Typography, ListItemText, Grid, Button } from '@material-ui/core';
import { Close as CloseIcon, LocationOn } from '@material-ui/icons';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const dronePoints = [
    {
        name: 'Москва',
        pos: [55.684758, 37.738521],
    },
    {
        name: 'Ульяновск',
        pos: [54.3187, 48.3978],
    },
    {
        name: 'Димитровград',
        pos: [54.2198, 49.6212],
    },
    {
        name: 'Сочи',
        pos: [43.6028, 39.7342],
    },
    {
        name: 'Сочи 2',
        pos: [44.6028, 39.7342],
    }
]

const DroneMap = ({ open, onClose, onSelect }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [coords, setCoords] = useState([55.75, 37.57]);
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
            <Grid container direction="column">
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
            </Grid>
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
