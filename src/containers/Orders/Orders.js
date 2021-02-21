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
        this.props.onFetchOrders(this.props.token, this.props.userId);
        
    }

    render() {
        
        let orders = <Spinner />;

        if(!this.props.loading && this.props.orders.length===0){
            orders = <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h4>You haven't made any orders yet</h4>
            </div>
        }

        if (!this.props.loading && this.props.orders.length) {
            orders = this.props.orders.map(object => {
                    return (
                     <Order key={object.id}
                            ingredients={object.ingredients}
                            price={object.price}
                            date={object.date}
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
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFetchOrders: (token, userId) => dispatch(actionCreators.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));