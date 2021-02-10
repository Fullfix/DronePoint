import { BottomNavigation, BottomNavigationAction, makeStyles } from '@material-ui/core'
import { ListAlt, MarkunreadMailbox, Menu, Functions } from '@material-ui/icons';
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.palette.primary.main,
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
        <!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(72212146, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/72212146" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
    )
}

export default BottomMenu
