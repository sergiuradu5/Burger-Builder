import React, { PureComponent } from "react";
import classes from "./ContactData.module.css";

import axios from "../../../axios-orders";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import jsConfigForm from "../../../helpers/JSConfigForm/JSConfigForm";
import {validateEmail} from '../../../helpers/validateEmail/validateEmail';
import {connect} from 'react-redux';
import * as actionCreators from '../../../store/actions/index';


class ContactData extends PureComponent {
  state = {
    orderForm: {
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
    },
    formIsValid: false,
  };

  checkValidity(value, rules) {
    let isValid  = true;
    
    if (rules.required) {
      isValid = (value.trim() !== '') && isValid; //it IS VALID if value.trim() ISN'T EMPTY
    } else if (rules.required===undefined) {
      isValid = true;
    }

    if (rules.minLength) {
      isValid = (value.length >= rules.minLength) && isValid;
    }

    if (rules.maxLength) {
      isValid = (value.length <= rules.maxLength) && isValid;
    }

    if (rules.isEmail) {
      isValid = validateEmail(value) && isValid;
  }
    return isValid;
  }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      //Creating key-value pairs, like the following: {name: "Max", email: "max@max.com"}
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ings,
      price: this.props.price.toFixed(2), //in a real-world app, prices should be calculated in the server, not in the SPA
      orderData: formData,
      userId: this.props.userId
    };

    this.props.onOrderBurger(order, this.props.token);

    
  };

  inputChangedHandler = (event, inputIdentifier) => {
     const updatedOrderForm = { //The nested objects are NEVER deeply copied with the ...(spread) operator
       ...this.state.orderForm
     };
     const updatedFormElement = {
       ...updatedOrderForm[inputIdentifier]
     };
     updatedFormElement.value = event.target.value;
     updatedFormElement.touched = true;
     
     updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
     
     updatedOrderForm[inputIdentifier] = updatedFormElement;
     
     let formIsValid = true;
     for (let inputIdentifier in updatedOrderForm)
     {
       formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
     }

     this.setState({
       orderForm: updatedOrderForm, formIsValid: formIsValid
     })
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }
    let form = (
        <form onSubmit ={this.orderHandler}>
        {formElementsArray.map(formElement => (
           <Input key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              valueType = {formElement.id}
              shouldValidate={formElement.config.validation}
              invalid={!formElement.config.valid}
              touched={formElement.config.touched}
              changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
        ))}
        <Button btnType="Success"
          disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) {
        form = <Spinner />
    }

    return (
    <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings : state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId : state.auth.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger : (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
