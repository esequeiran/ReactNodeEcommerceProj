import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getBraintreeClientToken, processPayment, createOrder } from './apiCore'
import { emptyCart } from './cartHelpers'
import Card from './Card'
import { isAuthenticated } from '../auth'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({ products, setRun = f => f, run = undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })



    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {

                setData({ ...data, error: data.error })
            } else {

                setData({ clientToken: data.clientToken })

            }
        })
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    const getTotal = () => {
        //currentValues is the acumulator
        //each item is nextValue to add
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const showCheckout = () => {
        return (
            isAuthenticated() ? (
                <div>{showDropIn()}</div>
            ) : (
                    <Link to="/signin">
                        <button className="btn btn-primary">Sign in to checkout</button>
                    </Link>)

        )
    }

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };

    const deliveryAddress = data.address;

    const buy = () => {
        setData({ loading: true })
        //send nonce to your server, nonce=data.instance.requestPaymentMethod
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                // console.log(data)
                // nonce = data.nonce
                // //once you have nonce(card type, card number) send nonce as 'paymentMethodNonce'
                // console.log('send noce and total to process: ', nonce, getTotal(products))
                nonce = data.nonce;

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }

                processPayment(userId, token, paymentData)
                    .then(response => {
                        //console.log(response)

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        }
                        createOrder(userId, token, createOrderData)
                        .then(response=>{
                            emptyCart(() => {
                                setRun(!run);
                                console.log('payment success and empty cart')
                               
                            })

                            setData({ ...data, success: true })
                        }).catch(error=>{
                            console.log(error)
                        })

                       
                      
                    })
                    .catch(error => {
                        console.log(error)
                        setData({ loading: false })
                    })
            })
            .catch(error => {
                console.log('dropping error: ', error)
                setData({ ...data, error: error.message })
            })

    }

    //unBlur is when whatever there's a click on the page this will run
    /**
     * paypal:{flow:'vault'}
     */
    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: '' })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>

                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>

                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: 'vault'
                            }

                        }}
                        onInstance={instance => (data.instance = instance)}
                    />
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ) : null}
        </div>
    )

    const showError = error => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {data.error}
        </div>
    )

    const showSuccess = success => (
        <div
            className="alert alert-info"
            style={{ display: success ? "" : "none" }}
        >
            Thanks! Your payment was successful
        </div>
    )

    const showLoading = loading => (
        loading && <h2>Loading...</h2>
    )


    return (<div>
        <h2>Total: ${getTotal()}</h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
    </div>)

}

export default Checkout;