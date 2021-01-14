import React from 'react';

import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';
import useSound from 'use-sound';
import blopSound from '../../../assets/sounds/blop.mp3';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Tomato', type: 'tomato' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];



const BuildControls = (props) => {
    const [playBlopSound] = useSound(blopSound);
    return (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>${props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl 
                key={ctrl.label} 
                label={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disabled={props.disabled[ctrl.type]} />
        ))}
        <button 
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={() => {
                props.ordered();
                playBlopSound();

            }}>ORDER NOW</button>
    </div>
    );
};

export default BuildControls;