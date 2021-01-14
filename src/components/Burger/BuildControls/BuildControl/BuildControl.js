import React from 'react';

import classes from './BuildControl.module.css';

import useSound from 'use-sound';
import highBlop from '../../../../assets/sounds/high-blop.mp3';
import lowBlop from '../../../../assets/sounds/low-blop.mp3';



const BuildControl = (props) => {
    const [playHighBlop] = useSound(highBlop);
    const [playLowBlop] = useSound(lowBlop);

    return(
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button 
            className={classes.Less} 
            onClick={() => {
                props.removed();
                playLowBlop();
            }} 
            disabled={props.disabled}>Less</button>
        <button 
            className={classes.More} 
            onClick={() => {
                props.added();
                playHighBlop();
            }}>
                More</button>
    </div>
    );
};

export default BuildControl;