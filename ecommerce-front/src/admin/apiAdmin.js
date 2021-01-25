import { API } from '../config'

export const createCategory = (userId, token, category) => {
   
    return fetch(`${API}/category/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        //JSON.STRINGIFY CONVERTS THE OBJECT TO A JSON STRING
        body: JSON.stringify(category)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const createProduct = (userId, token, product) => {
   
    return fetch(`${API}/product/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',            
            Authorization: `Bearer ${token}`
        },
        //JSON.STRINGIFY CONVERTS THE OBJECT TO A JSON STRING
        body: product
    })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const getCategories = () => {
    
    return fetch(`${API}/categories`,{
        method: "GET"
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

export const listOrders = (userId, token) => {
    
    return fetch(`${API}/order/${userId}`,{
        method: "GET",
        headers: {
            Accept: 'application/json',            
            Authorization: `Bearer ${token}`
        }
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

export const getStatusValues = (userId, token) => {
    
    return fetch(`${API}/order/status/${userId}`,{
        method: "GET",
        headers: {
            Accept: 'application/json',            
            Authorization: `Bearer ${token}`
        }
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}


export const updateOrderStatus = (userId, token, orderId, status) => {
    
    return fetch(`${API}/order/status/${orderId}/${userId}`,{
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({status, orderId})
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

/**
 * perform crud on products
 */

export const getProducts = () => {
    
    return fetch(`${API}/products?limit=undefined`,{
        method: "GET"
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

export const deleteProduct = (productId, userId, token) => {    
    return fetch(`${API}/product/${productId}/${userId}`,{
        method: "DELETE",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            Authorization: `Bearer ${token}`
        }        
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

export const getProduct = (productId) => {    
    return fetch(`${API}/product/${productId}/`,{
        method: "GET",       
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}

export const updateProduct = (productId, userId, token, product) => {    
    return fetch(`${API}/product/${productId}/${userId}`,{
        method: "PUT",
        headers: {
            Accept: 'application/json',                   
            Authorization: `Bearer ${token}`
        }, 
        body: product        
    })
    .then(response=>{
        return response.json()
    })
    .catch(error=> console.log(error))
}
