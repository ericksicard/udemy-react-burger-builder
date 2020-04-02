import React from 'react'

import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
    let transformedIngredients = Object.entries(props.ingredients)
                                    .map( pair => [ ...Array(pair[1]) ]
                                        .map( (x, idx) => <BurgerIngredient type={pair[0]} key={pair[0]+idx} /> )
                                    )
                                    .reduce( (acc, cur) => acc.concat(cur), []);                                    
    
    if ( !transformedIngredients.length ) transformedIngredients = <p>Please start adding some ingredients!</p>                        
    
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;