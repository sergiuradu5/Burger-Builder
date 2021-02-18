import {validateEmail} from '../validateEmail/validateEmail';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
};

export const checkValidity = (value, rules) => {
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