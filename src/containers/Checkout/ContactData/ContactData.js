import React, { PureComponent } from "react";

import axios from "../../../axios-orders";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.module.css";
class ContactData extends PureComponent {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice.toFixed(2), //in a real-world app, prices should be calculated in the server, not in the SPA
      customer: {
        name: "Sergiu",
        address: {
          street: "JNA 91",
          zipCode: "26216",
          contry: "Serbia",
        },
        email: "sergiu@radu.com",
      },
      deliveryMethod: "fastest",
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

  render() {
    let form = (
        <form>
        <input className={classes.Input}
          type="text"
          name="name"
          placeholder="Your name"
        ></input>
        <input className={classes.Input}
          type="text"
          name="email"
          placeholder="Your email"
        ></input>
        <input className={classes.Input}
          type="text"
          name="street"
          placeholder="Street"
        ></input>
        <input className={classes.Input}
          type="text"
          name="postalCode"
          placeholder="Postal code"
        ></input>
        <Button btnType="Success" clicked={this.orderHandler}>
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
