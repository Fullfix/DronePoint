import { Accordion, AccordionDetails, AccordionSummary,
   Box, Button, Checkbox, Container, Grid, IconButton, Link, makeStyles, Paper, Radio, RadioGroup, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import React, { useState } from 'react';
import { formattedDistance, formattedTime, calcCrow, droneVelocity } from '../../utils/display';

const useStyles = makeStyles(theme => ({
  info: {
    width: theme.breakpoints.width('sm') - 50,
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    },
  },
  tarif: {
    marginTop: 20,
  },
  radio: {
    marginTop: -4,
  },
  tarifLabel: {
    marginBottom: 15,
  },
  accordion: {
    boxShadow: 'none',
  }
}))


const OrderDetails = ({ placeTo, placeFrom, onSubmit, order }) => {
  const classes = useStyles();
  const [tariff, setTariff] = useState(80);
  const [comment, setComment] = useState('');
  const [acc, setAcc] = useState(null);
  const placed = !!(placeTo && placeFrom);

  const distance = placed && calcCrow(placeFrom.pos, placeTo.pos).toFixed(2);
  console.log(tariff);
  const info = [
    {
      label: 'Старт',
      value: placeFrom?.name || '-',
    },
    {
      label: 'Финиш',
      value: placeTo?.name || '-',
    },
    {
      label: 'Расстояние',
      value: placed ? formattedDistance(distance) : '-',
    },
    {
      label: 'Время доставки',
      value: placed ? formattedTime(distance * 1000 / droneVelocity) : '-',
    },
  ]
  const tariffes = [
    { label: 'Стандартный', value: 80, desc: 'Разовая пересылка от одного дронпоинта к другому.' },
    { label: 'Приоритетный', value: 130, 
      desc: 'Разовая пересылка от одного дронпоинта к другому, однако Ваш заказ будет доставлен раньше остальных.' },
    { label: 'По подписке', value: 69,
      desc: 'Выгодное решение для компаний, занимающимися частыми пересылками. Экономия составит 10%, а подписку можно оформить на разное количество отправок, в зависимости от ваших потребностей.' 
    },
  ]

  return (
    <React.Fragment>
      {!placed && <Typography variant="h3" align="center" color="textSecondary">
        Выберите место отправления и доставки, чтобы оформить заказ
      </Typography>}
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
            <Grid item>
              <Accordion className={classes.accordion} 
              expanded={acc === tarif.value}>
                <AccordionSummary>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h4" component="span"
                      onClick={() => setTariff(tarif.value)}>
                        <Radio color="primary" className={classes.radio}
                        checked={tariff === tarif.value}
                        onChange={() => setTariff(tarif.value)}/>
                        {tarif.label} ({tarif.value} ₽/км)
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={(e) => {
                        e.preventDefault();
                        if (acc === tarif.value) {
                          setAcc(null);
                        } else {
                          setAcc(tarif.value);
                        }
                      }}>
                        <Info color="action"/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h5">
                    {tarif.desc}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>)}
          </Grid>
        </Grid>
        <Grid item>
          <TextField variant="outlined" multiline fullWidth
          value={comment} onChange={e => setComment(e.target.value)}
          label="Название доставки"/>
        </Grid>
        <Grid item container justify="space-between">
          <Grid item>
            <Typography variant="h2">Сумма доставки</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2">
              {placed ? parseInt(distance * tariff) : '0'} ₽
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {!order && <Box width="300px">
          <Button variant="contained" color="primary" fullWidth style={{
            textTransform: 'none',
          }} onClick={() => onSubmit(
            distance, parseInt(distance * tariff), tariff, comment)}>
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
