import React, { Component } from 'react'
import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

    componentDidMount() {
        //GET Request for orders.json in firebase
        //...via the action creator inside actions/order.js
        this.props.onFetchOrders(this.props.token);
        
    }

    render() {
        
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = this.props.orders.map(object => {
                    return (
                     <Order key={object.id}
                            ingredients={object.ingredients}
                            price={object.price}
                    />
                    )})
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.order.loading,
        orders: state.order.orders,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFetchOrders: (token) => dispatch(actionCreators.fetchOrders(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));