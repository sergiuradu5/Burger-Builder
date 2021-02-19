import React, { PureComponent } from "react";
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
    resetClicked: false,
    autoCompleteClicked: false,
  };

  componentDidMount() {
    this.props.onFetchUserContactDataStart(
      this.props.token,
      this.props.userId
    )
  }

  autoCompleteForm = () => {
    const keys = Object.keys(this.state.orderForm);
    let autoCompletedForm = {};
      for (const key of keys){
        console.log('This is key: ', key);
        autoCompletedForm[key] = updateObject(this.state.orderForm[key], {
        value: this.props.contactData[key],
        valid: checkValidity(this.props.contactData[key], this.state.orderForm[key].validation),
        touched:  true
      });
    }
    
    this.setState({
      orderForm: autoCompletedForm,
      autoCompleteClicked: true,
      resetClicked: false
    });
  }

  resetForm = () => {
    const keys = Object.keys(this.state.orderForm);
    let resetForm = {};
      for (const key of keys){
        console.log('This is key: ', key);
        resetForm[key] = updateObject(this.state.orderForm[key], {
        value: '',
        valid: false,
        touched:  false
      });
    }
    this.setState({
      orderForm: resetForm,
      autoCompleteClicked: false,
      resetClicked: true
    });
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
      userId: this.props.userId,
      date: new Date()
    };

    this.props.onOrderBurger(order, this.props.token);

    
  };

  inputChangedHandler = (event, inputIdentifier) => {
     
     const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
        touched:  true
     });

     const updatedOrderForm = updateObject(this.state.orderForm, {
       [inputIdentifier]: updatedFormElement
     });
     
     
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

    let resetButton = null;
    if (!this.state.resetClicked && this.state.autoCompleteClicked && this.props.previousContactData) {
      resetButton = <div>
      <button 
            className={classes.Button}
            onClick={this.resetForm}>RESET</button>
        <h5>Click here if you want to reset and empty your form</h5>
    </div>
    }

    let autoCompleteButton = null;
    if (this.props.contactData && !this.state.autoCompleteClicked && this.props.previousContactData) {
      autoCompleteButton = 
      <div>
        <button 
            className={classes.Button}
            onClick={this.autoCompleteForm}>AUTO-COMPLETE</button>
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
