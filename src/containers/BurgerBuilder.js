import React, { Component } from 'react';
import Aux from '../hoc/Aux/Aux';

import Burger from '../components/Burger/Burger';
import BuildControls from '../components/Burger/BuildControls/BuildControls';
import Modal from '../components/UI/Modal/Modal';
import OrderSummary from '../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
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
        alert('You continue!')
    }

    render() {
        // disabling the "Less" button if there is no ingredient to remove
        const disabledInfo = { ...this.state.ingredients } 
        for ( let key in disabledInfo) { 
            disabledInfo[key] = disabledInfo[key] <= 0;  // {salad: true, meat: false, ...}
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        orderCancelled={this.purchaseCancelHandler}
                        purchaseContinue={this.purchaseContinuelHandler}
                    />    
                </ Modal>
                <Burger ingredients={this.state.ingredients}/>
                <div>Build Controls</div>
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
    }
};

export default BurgerBuilder