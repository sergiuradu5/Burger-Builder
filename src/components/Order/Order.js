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

    // if(props.ingredients) {
    //     Object.keys(props.ingredients)
    //         .map(key => {
    //             let ingredient = String(key);
    //             ingredient = ingredient[0].toUpperCase() + ingredient.slice(1);
    //             let amount = props.ingredients[key].toString();
    //             ingredients += `${ingredient}: ${amount}, `;
    //             return null;
    //         })
    //     ingredients = ingredients.slice(0, ingredients.length-2);
    // }
    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>${props.price}</strong></p>
        </div>
    );
}

export default Order;