import React from 'react';
import './BurgerCSSBuild.css';
const BurgerCSSBuild = (props) => {
    return (
    <div className="box">
        <div class="bread-top">
            <div className="seeds"></div>
            <div className="seeds2"></div>
        </div>
        <div class="salad"></div>
        <div class="bacon"></div>
        <div class="cheese"></div>
        <div class="meat"></div>
        <div class="bread-bottom"></div>
    </div>
    );
}

export default BurgerCSSBuild;