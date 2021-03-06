import React from 'react';
import classes from './Order.module.css';
const Order = (props) => {

    const ingredients = [];
    for (let ingredientName in props.ingredients) {
        ingredients.push({
            ingredient: ingredientName,
            amount: props.ingredients[ingredientName]});
    };
    const ingredientsOutput = ingredients.map(ig => {
        return <span 
        style={{
            textTransform:'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid #ccc',
            padding: '5px'
        }}
        key={ig.ingredient}>{ig.ingredient}: {ig.amount} </span>
    }); 
    
    const date=new Date(props.date);
    const dateOutput = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
   
    
    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>${props.price}</strong></p>
            <p>Date: <strong>{dateOutput}</strong></p>
        </div>
    );
}

export default Order;