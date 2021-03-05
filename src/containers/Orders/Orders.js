import React, { useEffect } from 'react'
import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const Orders = props => {

    const { onFetchOrders} = props;

    useEffect(() => {
        //GET Request for orders.json in firebase
        //...via the action creator inside actions/order.js
        props.onFetchOrders(props.token, props.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onFetchOrders]);

    
        
        let orders = <Spinner />;

        if(!props.loading && props.orders.length===0){
            orders = <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h4>You haven't made any orders yet</h4>
            </div>
        }

        if (!props.loading && props.orders.length) {
            orders = props.orders.map(object => {
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