import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import ShowImage from './ShowImage'
import moment, { updateLocale } from 'moment'
import {addItem, updateItem, removeItem} from './cartHelpers'

const Card = ({ 
    product,
    showViewProductButton= true, 
    showAddtoCartBtn=true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = f => f,
    run = undefined }) => {

    const [redirect, setRedirect] = useState(false)
    const [count, setCount] = useState(product.count)

    const showViewButton = showViewProductButton =>{
        return(
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                <button className="btn btn-outline-primary mr-2 mt-2 mb-2">
                View product
                 </button>
                </Link>
            )
        )
    }

    const addToCart = () =>{
        addItem(product, ()=>{
            setRedirect(true)
        })
    }

    const shouldRedirect = (redirect) =>{
        if(redirect){
            return <Redirect to="/cart"/>
        }
    }
    
    const showAddToCardButton = showAddtoCartBtn=>(
        showAddtoCartBtn && (<button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
        Add to cart
    </button>)
        
    )

    const showRemoveButton = showRemoveProductButton =>{
      
        return(
        showRemoveProductButton && (
        <button 
        onClick={()=>{
            removeItem(product._id);
            setRun(!run);
        }}  
        className="btn btn-outline-danger mt-2 mb-2"
        >
        Remove product
    </button>
    )
        
    )}

    const showStock = (quantity) =>{
        return quantity > 0 ? 
        (<span className="badge badge-primary badge-pill">In stock</span>) 
        : (<span className="badge badge-primary badge-pill">Out of stock</span>)
    }

    const handleChange = productId => e=>{
        setRun(!run)
        setCount(e.target.value < 1? 1 : e.target.value)
        if(e.target.value >= 1){
            updateItem(productId, e.target.value)
        }
    }
    const showCartUpdateOptions = (cartUpdate) =>{
        return cartUpdate && <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Adjust quantity</span>
                </div>
                <input type="number" className="form-control" value={count} onChange={handleChange(product._id)}/>
            </div>
        </div>
    }
    return (
      
            <div className="card">
                <div className="card-header name">
                    {product.name}
                </div>
                <div className="card-body">
                    {shouldRedirect(redirect)}
                    <ShowImage item={product} url="product" />
                    <p className="lead mt-2">{product.description.substring(0, 100)}</p>
                    <p className="black-10">${product.price}</p>
                    <p className="black-9">Category: {product.category && product.category.name}</p>
                    <p className="black-8">Added on: {moment(product.createdAt).fromNow()}</p>

                        {showStock(product.quantity)}
                        <br/>

                        {showViewButton(showViewProductButton)}

                        {showAddToCardButton(showAddtoCartBtn)}

                        {showRemoveButton(showRemoveProductButton)}

                        {showCartUpdateOptions(cartUpdate)}
                </div>
            </div>
       
    )
}

export default Card;