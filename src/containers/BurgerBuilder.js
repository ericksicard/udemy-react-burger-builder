import React, { Component } from 'react';
import Aux from '../hoc/Aux/Aux';

import Burger from '../components/Burger/Burger';
import BuildControls from '../components/Burger/BuildControls/BuildControls';
import Modal from '../components/UI/Modal/Modal';
import OrderSummary from '../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../components/UI/Spinner/Spinner'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import axios from '../axios-orders'

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-burger-b555d.firebaseio.com/ingredients.json')
            .then( response => {
                this.setState({ ingredients: response.data })
            })
            .catch( error => {
                this.setState({ error: true })
            })
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.values(ingredients)
                        .reduce( (acc, cur) => {
                            return acc + cur;
                        }, 0 );

        this.setState({ purchasable: sum > 0 })
    }

    addIngredientHandler = ( type ) =>{
        // adding ingredient
        const updatedIngredients = { ...this.state.ingredients }
        updatedIngredients[type] += 1;

        // increasing the total price
        const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        
        // updating state
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        })

        // updating purchasable
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = ( type ) =>{
        // removing ingredient
        const updatedIngredients = { ...this.state.ingredients };
        // checking for ingredient to remove
        if ( updatedIngredients[type] <= 0 ) {
            return
        }
        updatedIngredients[type] -= 1;

        // lowering the total price
        const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

        // updating state
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice,
        })
        
        // updating purchasable
        this.updatePurchaseState(updatedIngredients)
    }

    purchasseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinuelHandler = () => {
        this.setState({ loading: true })
        
        const order = {
            ingredients: this.state.ingredients,
            proce: this.state.totalPrice,
            customer: {
                name: 'Erick',
                address: {
                    street: 'test',
                    zipCode: '123456',
                    country: 'US'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('orders.json', order)
            .then( response => {
                this.setState({ loading: false, purchasing: false })
            })
            .catch( err => {
                this.setState({ loading: false, purchasing: false })
            });
    }

    render() {

        // disabling the "Less" button if there is no ingredient to remove
        const disabledInfo = { ...this.state.ingredients } 
        for ( let key in disabledInfo) { 
            disabledInfo[key] = disabledInfo[key] <= 0;  // {salad: true, meat: false, ...}
        }

        //Implementing spinner
        let orderSummary = null;
        let burger = this.state.error ? <p>The ingredients couldn't be uploaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchasseHandler}
                    />
                </Aux>
            );

            orderSummary =  <OrderSummary 
                                ingredients={this.state.ingredients}
                                price={this.state.totalPrice}
                                orderCancelled={this.purchaseCancelHandler}
                                purchaseContinue={this.purchaseContinuelHandler}
                            />
            if ( this.state.loading ) {
                orderSummary = <Spinner />
            }
        }


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}   
                </ Modal>
                {burger}
            </Aux>
        );
    }
};

export default withErrorHandler( BurgerBuilder, axios );