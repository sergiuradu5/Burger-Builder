import React, { useState, useEffect } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import {Redirect} from 'react-router-dom';

import {updateObject, checkValidity} from '../../helpers/utility/utility';

import {connect} from 'react-redux';

import * as actions from '../../store/actions/index';

const Auth = (props) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSignup, setIsSignup] = useState(true);
    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;
    const [controls, setControls] = useState({
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

            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true, 
                    minLength: 6
                },
                valid: false,
                touched: false
            }  
        });


    const checkForEmptyIngredients = () => {
        let sumOfElements = 0;
       for (const [key] of Object.entries(props.ingredients)) {
            sumOfElements += props.ingredients[key];
       }
       return sumOfElements > 0;
    }

    useEffect(() => {
        if (!props.building && props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath('/');
        }
        if (props.building && props.ingredients !== null && checkForEmptyIngredients() && props.authRedirectPath === '/') {
            //if we started building a burger, and the ingredients object is not null, nor empty, and the authRedirectPath is to homepage ('/', or '/burger', it's the same)
            //make the authRedirectPath to '/checkout' because we have already started building a burger and we want to buy it
            props.onSetAuthRedirectPath('/checkout');
        }
    }, [onSetAuthRedirectPath, buildingBurger, authRedirectPath]);

   const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
            [controlName] : updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true 
                })
        });
        
       let isFormValid = true;

       for (let control in updatedControls) {
           if (!updatedControls[control].valid) {
               isFormValid = false;
               break;
           }
       }
        setControls(updatedControls);
        setIsFormValid(isFormValid);
        
    }

    

    const submitHandler = (event) => {
        event.preventDefault();
        let method = '';
        if (isSignup) {
            method = "signUp";
        } else {
            method = "signIn";
        }
        
        props.onAuth(controls.email.value, controls.password.value, method)
    }

    const switchAuthModeHandler = ( ) => {
        setIsSignup(!isSignup);
    }

    
        const formElementsArray = [];
        for (let key in controls) {
            formElementsArray.push({
            id: key,
            config: controls[key]
        })}
            
        let form = formElementsArray.map((formElement) =>
             <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                valueType = {formElement.id}
                shouldValidate={formElement.config.validation}
                invalid={!formElement.config.valid}
                touched={formElement.config.touched} 
                changed={(event) => inputChangedHandler(event, formElement.id)}/>
        );

        if (props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if (props.error) {
            errorMessage = (
                <h2 className={classes.ErrorMessage}>{props.error}</h2>
            );  
        }
       
        let redirect = null;
        if (props.isAuthenticated===true)
        {
            redirect = <Redirect to={props.authRedirectPath} />;
        }
        return (
            
            <div className={classes.Auth}>
            {redirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
            {form}
            <Button btnType="Success"
            disabled={!isFormValid}
            >SUBMIT </Button>
            </form>
            <Button btnType="Danger" 
            clicked={switchAuthModeHandler}>
                SWITCH TO {isSignup ? "SIGN IN" : "SIGN UP"}</Button>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath:state.auth.authRedirectPath,
        ingredients: state.burgerBuilder.ingredients
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, method) => dispatch(actions.auth(email, password, method)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);