import React from "react";
import classes from "./Input.module.css";
const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement]; //A const for changing the CSS classes dynamically...
                                              //...based on the validity of the introduced element
  let validationError = null;                                              
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    let valueType = props.valueType.replace(/([A-Z])/g,' $1');
    valueType = valueType.charAt(0).toUpperCase()+valueType.slice(1);
    validationError = <p className={classes.ValidationError}> Please enter a valid {valueType}</p>
  }
  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}

        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}

        />
      );
      break;
    case "select":
    inputElement = (
        <select
        className={inputClasses.join(' ')}
        value={props.value}
        onChange={props.changed}>
            {props.elementConfig.options.map(option => (
                <option key={option.value}  
                value={option.value}> 
                {option.displayValue}</option>
            ))}
            

        </select>
    );
    break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default Input;
