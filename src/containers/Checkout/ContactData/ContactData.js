import React, { useState, useEffect } from "react";
import classes from "./ContactData.module.css";

import axios from "../../../axios-orders";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import {updateObject} from '../../../helpers/utility/utility';

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import jsConfigForm from "../../../helpers/JSConfigForm/JSConfigForm";
import {checkValidity} from '../../../helpers/utility/utility';
import {connect} from 'react-redux';
import * as actionCreators from '../../../store/actions/index';


const ContactData =  (props) => {
  const [autoCompleteClicked, setAutoCompleteClicked] = useState(false);
  const [resetClicked, setResetClicked] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [ orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    surname: jsConfigForm("input", "text", "Your Surname", "", "required"),
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email Address'
      },
      value: '',
      validation: {
        required: true, 
        isEmail: true
      },
      valid: false,
      touched: false
    },
    country: jsConfigForm("input", "text", "Your Country", "", "required"),
    address: jsConfigForm("input", "text", "Street Address", "", "required"),
    postalCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Postal Code'
      },
      value: '',
      validation: {
        minLength: 6,
        maxLength: 6
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          {value: 'fastest', displayValue: 'Fastest '},
          {value: 'cheapest', displayValue: 'Cheapest '},
        ]
      },
      value: 'fastest',
      valid: true,
      validation: {}
    }
  })

  useEffect(() => {
    props.onFetchUserContactDataStart(
      localStorage.getItem('token'),
      localStorage.getItem('userId')
    )
  }, []);

  const checkEntireFormValidity = (updatedOrderForm) =>  {
    let formIsValid = true;
     for (let inputIdentifier in updatedOrderForm)
     {
       formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
     }
     return formIsValid;
  }

  const autoCompleteForm = () => {
    const keys = Object.keys(orderForm);
    let autoCompletedForm = {};
      for (const key of keys){
        autoCompletedForm[key] = updateObject(orderForm[key], {
        value: props.contactData[key],
        valid: checkValidity(props.contactData[key], orderForm[key].validation),
        touched:  true
      });
    }

    let formIsValid = checkEntireFormValidity(autoCompletedForm);
    setOrderForm(autoCompletedForm);
    setFormIsValid(formIsValid);
    setAutoCompleteClicked(true);
    setResetClicked(false);
  }

  const resetForm = () => {
    const keys = Object.keys(orderForm);
    let resetForm = {};
      for (const key of keys){
        resetForm[key] = updateObject(orderForm[key], {
        value: '',
        valid: false,
        touched:  false
      });
    }
    
      setOrderForm(resetForm);
      setAutoCompleteClicked(false);
      setResetClicked(true);
      setFormIsValid(false);
    
  }

  const orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      //Creating key-value pairs, like the following: {name: "Max", email: "max@max.com"}
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }

    
    const order = {
      ingredients: props.ings,
      price: props.price.toFixed(2), //in a real-world app, prices should be calculated in the server, not in the SPA
      orderData: formData,
      userId: props.userId,
      date: new Date()
    };

    props.onOrderBurger(order, props.token);

  };

  const inputChangedHandler = (event, inputIdentifier) => {
     
     const updatedFormElement = updateObject(orderForm[inputIdentifier], {
        value: event.target.value,
        valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
        touched:  true
     });

     const updatedOrderForm = updateObject(orderForm, {
       [inputIdentifier]: updatedFormElement
     });
     
     
     let formIsValid = checkEntireFormValidity(updatedOrderForm);

     
     setOrderForm(updatedOrderForm);
     setFormIsValid(formIsValid);
    
  }

  
    

    const formElementsArray = [];
    for (let key in orderForm) {
      formElementsArray.push({
        id: key,
        config: orderForm[key]
      })
    }
    let form = (
        <form onSubmit ={orderHandler}>
        {formElementsArray.map(formElement => (
           <Input key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              valueType = {formElement.id}
              shouldValidate={formElement.config.validation}
              invalid={!formElement.config.valid}
              touched={formElement.config.touched}
              changed={(event) => inputChangedHandler(event, formElement.id)}/>
        ))}
        <Button btnType="Success"
          disabled={!formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (props.loading) {
        form = <Spinner />
    }

    let resetButton = null;
    if (!resetClicked && autoCompleteClicked && props.previousContactData) {
      resetButton = <div>
      <button 
            className={classes.Button}
            onClick={resetForm}>RESET</button>
        <h5>Click here if you want to reset and empty your form</h5>
    </div>
    }

    let autoCompleteButton = null;
    if (props.contactData && !autoCompleteClicked && props.previousContactData) {
      autoCompleteButton = 
      <div>
        <button 
            className={classes.Button}
            onClick={autoCompleteForm}>AUTO-COMPLETE</button>
        <h5>Click here if you want to auto-complete your order with your contact data from the previous order</h5>
    </div>
    }

    return (
    <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
      {autoCompleteButton}
      {resetButton}
        {form}
    </div>
    );
}

const mapStateToProps = (state) => {
  return {
    ings : state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId : state.auth.userId,
    contactData: state.userContactData.contactData,
    previousContactData: state.userContactData.contactData !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger : (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token)),
    onFetchUserContactDataStart: (token, userId) => dispatch(actionCreators.fetchUserContactDataStart(token, userId))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
