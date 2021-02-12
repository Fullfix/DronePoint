import { BottomNavigation, BottomNavigationAction, makeStyles } from '@material-ui/core'
import { ListAlt, MarkunreadMailbox, Menu, Functions } from '@material-ui/icons';
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        width: theme.breakpoints.width('sm'),
        backgroundColor: theme.palette.primary.main,
        position: 'fixed',
        bottom: 0,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        }
    },
    button: {
        color: theme.palette.primary.contrastText,
        '&$selected': {
            color: 'black',
        }
    },
    selected: {
        color: theme.palette.text.primary,
    }
}))

const BottomMenu = () => {
    const classes = useStyles();
    const router = useLocation();
    const path = router.pathname.slice(1);
    const btnClasses = { selected: classes.selected };
    const history = useHistory();
    const onChange = (event, newValue) => {
        if (path !== newValue) {
            history.push(`/${newValue}`);
        }
    }
    return (
        <BottomNavigation showLabels className={classes.root}
        onChange={onChange} value={path}>
            <BottomNavigationAction label="Заказать" className={classes.button}
            classes={btnClasses}
            icon={<MarkunreadMailbox />} value="makeorder"/>
            <BottomNavigationAction label="Мои доставки" className={classes.button}
            classes={btnClasses}
            icon={<ListAlt />} value="myorders"/>
            <BottomNavigationAction label="Меню" className={classes.button}
            classes={btnClasses}
            icon={<Menu />} value="menu"/>
            <BottomNavigationAction label="Калькулятор" className={classes.button}
            classes={btnClasses}
            icon={<Functions />} value="calc"/>
        </BottomNavigation>
    )
}

export default BottomMenu
