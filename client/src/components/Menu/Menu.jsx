import { List, ListItem, ListItemIcon, 
    ListItemText, Divider, ListItemSecondaryAction, 
    makeStyles } from '@material-ui/core'
import React from 'react'
import HeaderMenu from '../shared/HeaderMenu'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoIcon from '@material-ui/icons/Info';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    list: {
        marginTop: '10px',
    },
    item: {
        marginTop: '7px',
        marginBottom: '7px',
    }
}))

const Menu = () => {
    const classes = useStyles();
    const history = useHistory();
    const list = [
        {
            title: 'Действия с личным кабинетом',
            link: '/profile',
            icon: <ExitToAppIcon />
        },
        {
            title: 'Подписка (настройки подписки)',
            link: '/subscription',
            icon: <AssignmentIcon />
        },
        {
            title: 'О компании (ссылки на соц. сети)',
            link: '/about',
            icon: <InfoIcon />
        },
    ]
    return (
        <React.Fragment>
            <HeaderMenu text={'Меню'}/>
            <List component="nav" className={classes.list}>
                {list.map((item, i) => (
                    <React.Fragment>
                        <ListItem button onClick={() => {
                            history.push(item.link);
                        }} className={classes.item}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title}
                            // primaryTypographyProps={{ className: classes.name }}
                            // secondary={statusToText[order.state].text}
                            // secondaryTypographyProps={{ style: 
                            // { color: statusToText[order.state].color}}}
                            />
                            <ListItemSecondaryAction>
                                <ChevronRightIcon />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        </React.Fragment>
    )
}

export default Menu
