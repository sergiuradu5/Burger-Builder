import React, { PureComponent } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import {Redirect} from 'react-router-dom';

import {updateObject, checkValidity} from '../../helpers/utility/utility';

import {connect} from 'react-redux';

import * as actions from '../../store/actions/index';

class Auth extends PureComponent {
    state = {
        controls: {
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
        },
        isSignup: true
    };

    checkForEmptyIngredients = () => {
        let sumOfElements = 0;
       for (const [key] of Object.entries(this.props.ingredients)) {
            sumOfElements += this.props.ingredients[key];
       }
       return sumOfElements > 0;
    }

    componentDidMount() {
        if (!this.props.building && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath('/');
        }
        if (this.props.building && this.props.ingredients !== null && this.checkForEmptyIngredients() && this.props.authRedirectPath === '/') {
            //if we started building a burger, and the ingredients object is not null, nor empty, and the authRedirectPath is to homepage ('/', or '/burger', it's the same)
            //make the authRedirectPath to '/checkout' because we have already started building a burger and we want to buy it
            this.props.onSetAuthRedirectPath('/checkout');
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName] : updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true 
                })
        });
        
        
        this.setState({controls: updatedControls});  
    }

    

    submitHandler = (event) => {
        event.preventDefault();
        let method = '';
        if (this.state.isSignup) {
            method = "signUp";
        } else {
            method = "signIn";
        }
        
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, method)
    }

    switchAuthModeHandler = ( ) => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup }
        })
    }

    render() { 
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
            id: key,
            config: this.state.controls[key]
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
                changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
        );

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <h2 className={classes.ErrorMessage}>{this.props.error}</h2>
            );  
        }
       
        let redirect = null;
        if (this.props.isAuthenticated===true)
        {
            redirect = <Redirect to={this.props.authRedirectPath} />;
        }
        return (
            
            <div className={classes.Auth}>
            {redirect}
            {errorMessage}
            <form onSubmit={this.submitHandler}>
            {form}
            <Button btnType="Success">SUBMIT </Button>
            </form>
            <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
                SWITCH TO {this.state.isSignup ? "SIGN IN" : "SIGN UP"}</Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
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