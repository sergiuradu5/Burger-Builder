import React, { PureComponent } from "react";
import axios from "../../../axios-orders";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.module.css";
import Input from "../../../components/UI/Input/Input";
import jsConfigForm from "../../../helpers/JSConfigForm/JSConfigForm";
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
        email: jsConfigForm("input", "email", "Your E-mail", "", "required"),
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
    loading: false,
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
      ingredients: this.props.ingredients,
      price: this.props.totalPrice.toFixed(2), //in a real-world app, prices should be calculated in the server, not in the SPA
      orderData: formData
    };

    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        alert("Your order was successfully processed!");
        this.props.history.push('/burger');
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
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
    if (this.state.loading) {
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

export default ContactData;
