import { Link, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import HeaderMenu from '../shared/HeaderMenu'
import InstagramIcon from '@material-ui/icons/Instagram';

const useStyles = makeStyles(theme => ({
    list: {
        marginTop: '20px',
    },
    logo: {
        width: '50px',
        height: '50px',
        color: 'black',
    },
}))

const About = () => {
    const classes = useStyles();
    const list = [
        {
            icon: <InstagramIcon className={classes.logo}/>,
            link: 'https://www.instagram.com/deli_drone',
        },
        {
            icon: <img src="/vk.png" className={classes.logo} />,
            link: 'https://vk.com/delidrone',
        }
    ]
    return (
        <React.Fragment>
            <HeaderMenu text={'О компании'} />
            <List className={classes.list}>
                {list.map(item => (
                    <ListItem>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText align="right">
                            <Link href={item.link}
                            variant="h5"
                            color="secondary">{item.link}</Link>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    )
}

export default About
