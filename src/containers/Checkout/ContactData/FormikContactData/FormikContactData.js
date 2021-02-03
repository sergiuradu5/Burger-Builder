import React, {useState, useRef} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from '../../../../axios-orders';
import Button from "../../../../components/UI/Button/Button";
import classes from "../ContactData.module.css";
import inputClasses from "../../../../components/UI/Input/Input.module.css";
import Spinner from "../../../../components/UI/Spinner/Spinner";
const initialValues = {
  name: "",
  email: "",
  postCode: "",
  deliveryMethod: "fastest",
};

const validate = (values) => {
  //values.name, values.email, values.postCode, values.deliveryMethod
  //errors.name, errors.email, errors.postCode, errors.deliveryMethod
  //errors.name = "This field is required"
  let errors = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(values.email)) {
    errors.email = "Invalid email";
  }

  if (!values.postCode) {
    errors.postCode = "Required";
  } else if (values.postCode.length !== 6) {
    errors.postCode = "Must have 6 characters";
  }

  return errors;
};

Yup.addMethod(Yup.string, 'integer', function () { //Adding a method to Yup for checking if the field has digits only
    return this.matches(/^\d+$/, 'The field should have digits only')
  })

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid E-mail').required('Required'),
    postCode: Yup.string()
        .integer()
        .min(6, 'Must have 6 digits')
        .max(6, 'Must have 6 digits')   
        .required('Required')
})

const FormikContactData = (props) => {
    const [loadingState, setLoadingState] = useState({loading: false});

  const formik = useFormik({
    initialValues,
    // validate,
    validationSchema,
    onSubmit: values => {
        
         const order = {
         ingredients: props.ingredients,
         price: props.totalPrice.toFixed(2), //in a real-world app, prices should be calculated in the server, not in the SPA
         orderData: values
        };
        setLoadingState({loading: true});
    
        axios
          .post("/orders.json", order)
          .then((response) => {
            setLoadingState({loading: false});
            alert("Your order was successfully processed!");
            props.history.push('/burger');
          })
          .catch((error) => {
            setLoadingState({loading: false});
            console.log(error);
          });

}
  });
  

  const dynamicInputClasses = [
    inputClasses.InputElement,
    inputClasses.Input,
  ];

  console.log('Formik values: ', formik.values);

  let form = (
    <form onSubmit={formik.handleSubmit}>
        <div className="form-control">
          {/* <label htmlFor="name">Full Name</label> */}
          <input
            className={dynamicInputClasses.join(' ') + (formik.errors.name && formik.touched.name ? ' ' + inputClasses.Invalid : '')}
            type="text"
            name="name"
            id="name"
            placeholder="Your Full Name"
            onChange={formik.handleChange}
            value={formik.values.name}
            onBlur={formik.handleBlur}
          ></input>
          {formik.touched.name && formik.errors.name ? (
            <div className={inputClasses.ValidationError}>
              {formik.errors.name}
            </div>
          ) : null}
        </div>
        <div className="form-control">
          {/* <label htmlFor="name">Name</label> */}
          <input
            className={dynamicInputClasses.join(' ') + (formik.errors.email && formik.touched.email ? ' ' + inputClasses.Invalid : '')}
            type="email"
            name="email"
            id="email"
            placeholder="Your E-mail"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
          ></input>
          {formik.touched.email && formik.errors.email ? (
            <div className={inputClasses.ValidationError}>
              {formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="form-control">
          {/* <label htmlFor="postCode">Post Code</label> */}
          <input
            className={dynamicInputClasses.join(' ') + (formik.errors.postCode && formik.touched.postCode  ? ' ' + inputClasses.Invalid : '')}
            type="text"
            name="postCode"
            id="postCode"
            placeholder="Your Post Code"
            onChange={formik.handleChange}
            value={formik.values.postCode}
            onBlur={formik.handleBlur}
          ></input>
          {formik.touched.postCode && formik.errors.postCode ? (
            <div className={inputClasses.ValidationError}>
              {formik.errors.postCode}
            </div>
          ) : null}
        </div>
        <div className="form-control">
          {/* <label htmlFor="deliveryMethod">Delivery Method</label> */}
          <select
            className={dynamicInputClasses.join(' ') + (formik.errors.deliveryMethod && formik.touched.deliveryMethod ? ' ' + inputClasses.Invalid : '')}
            type="select"
            name="deliveryMethod"
            id="deliveryMethod"
            placeholder="Select Your Delivery Method"
            onChange={formik.handleChange}
            value={formik.values.deliveryMethod}
            onBlur={formik.handleBlur}
          >
            <option value="fastest">Fastest</option>
            <option value="cheapest">Cheapest</option>
          </select>
          {formik.touched.deliveryMethod && formik.errors.deliveryMethod ? (
            <div className={inputClasses.ValidationError}>
              {formik.errors.deliveryMethod}
            </div>
          ) : null}
        </div>
        ` `
        <Button type="submit" btnType="Success" disabled={false}>
          ORDER
        </Button>
      </form>
  );

  if (loadingState.loading) {
    form = <Spinner />;
  }

  return (
    <div className={classes.ContactData}>
      {form}
    </div>
  );
}

export default FormikContactData;
