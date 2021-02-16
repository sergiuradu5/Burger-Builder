import React, { PureComponent } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import {Redirect} from 'react-router-dom';


import {validateEmail} from '../../helpers/validateEmail/validateEmail';

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

    componentDidMount() {
        if (!this.props.building && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath('/');
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName] : {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true 
            }
        };
        
        this.setState({controls: updatedControls});  
    }

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

        if(rules.isEmail) {
            isValid = validateEmail(value) && isValid;
        }

        return isValid;
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
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, method) => dispatch(actions.auth(email, password, method)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);