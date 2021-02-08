import React, { Component } from 'react'
import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
        //GET Request for orders.json in firebase
        //We get the response.data as a json object...
        //...then we parse the data and turn it into an array 
        axios.get('/orders.json')
            .then(response => {
                const fetchedOrders = [];
                for (let key in response.data) {
                     fetchedOrders.push({
                         ...response.data[key],
                         id: key
                     });
                }
                this.setState({
                    orders: fetchedOrders,
                    loading: false
                });
            })
            .catch(error =>{
                console.log(error);
                this.setState({loading: false});
            });
    }

    render() {
        
        let orders = <Spinner />;
        if (!this.state.loading) {
            orders = this.state.orders.map(object => {
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

export default withErrorHandler(Orders, axios);