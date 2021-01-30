import React, {useState, useCallback} from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
    
const NavigationItems = () => {
    const [active, setActive] = useState(true);
    const switchActiveState = useCallback(() => {
        setActive(!active);
        console.log(active);
    }, [active]);

    return (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/burger" active={active} onClick={switchActiveState}>Burger Builder</NavigationItem>
        <NavigationItem link="/my-orders" active={!active} onClick={switchActiveState}>My Orders</NavigationItem>
    </ul>
    );
};

export default NavigationItems;