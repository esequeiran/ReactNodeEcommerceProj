import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { getCategories, getProduct, updateProduct } from './apiAdmin'
import { Redirect } from 'react-router-dom'


const UpdateProduct = ({match}) => {


    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    const { user, token } = isAuthenticated();


    //load categories and set form data
    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({categories: data,  formData: new FormData()})
            }
        })
    }

    const init = productId=>{
        getProduct(productId).then(
            data=>{
                if(data.error){
                    setValues({...values, data: data.error})
                }else{
                    setValues({...values, 
                        name: data.name,
                        description: data.description, 
                        price: data.price,
                        category: data.category,
                        shipping: data.shipping,
                        quantity: data.quantity,
                        formData: new FormData()
                    })
                    initCategories()
                }
            }
        )
    }


    useEffect(() => {
        init(match.params.productId);

    }, [])

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        formData.set(name, value)
        setValues({ ...values, [name]: value })

    }


    const clickSubmit = e => {
        e.preventDefault()

        setValues({ error: '', loading: true, createdProduct : ''})

        updateProduct(match.params.productId, user._id, token, formData)
            .then(data => {
                
                if (data.error) {
                    setValues({ ...values, error: data.error, createdProduct:'' })
                } else {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        photo: '',
                        price: '',
                        quantity: '',
                        loading: '',
                        error: false,
                        redirectToProfile: true,
                        createdProduct: data.name
                    })
                }
            })
    }

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post photo</h4>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    <input
                        onChange={handleChange('photo')}
                        type="file"
                        name="photo"
                        accept="image/*" />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea
                    onChange={handleChange('description')}
                    type="text"
                    className="form-control"
                    value={description} />
            </div>
            <div className="form-group">
                <label className="text-muted">Price</label>
                <input
                    onChange={handleChange('price')}
                    type="number"
                    className="form-control"
                    value={price} />
            </div>
            <div className="form-group">
                <label className="text-muted">Category</label>
                <select
                    onChange={handleChange('category')}
                    className="form-control" >
                    <option>Please select</option>

                    {categories && categories.map((c, i) => (
                        <option key={i} value={c._id}>{c.name}</option>
                    ))}


                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input
                    onChange={handleChange('quantity')}
                    type="number"
                    className="form-control"
                    value={quantity} />
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select
                    onChange={handleChange('shipping')}
                    className="form-control">
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>

                </select>
            </div>
            <button className="btn btn-outline-primary">Update product</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            <h2>{error}</h2>
        </div>
    )

    const showSuccess = () => {
        console.log("createdProduct value: ", createdProduct)
        if(createdProduct){
            console.log("hola")
            return(
                <div className="alert alert-info"> 
                <h2>{`${createdProduct}`} has been updated</h2>
                </div>
            )
        }
    }    

    const showLoading = () => (
        loading && (<div
            className="alert alert-info">
            <h2>Loading...</h2>
        </div>)
    )

    const redirectUser = () =>{
        if(redirectToProfile){
            if(!error){
                return <Redirect to="/" />
            }
        }
    }

    return (<Layout title="Add a new product" description={`G'day ${user.name}!, ready to add a new product`} >
        <div className="row">
            <div className="col-md-8 offset-md-2">
            {JSON.stringify(createdProduct)}
                {showLoading()}
                {showSuccess()}
                {showError()}
                {newPostForm()}
                {redirectUser()}               
            </div>

        </div>
      
    </Layout>)
}

export default UpdateProduct;
