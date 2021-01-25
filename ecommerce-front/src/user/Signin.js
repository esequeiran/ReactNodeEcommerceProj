import React, { useState } from 'react'
import {Redirect} from 'react-router-dom'
import Layout from '../core/Layout'
import {signin, authenticate, isAuthenticated} from '../auth'

const Signin = () => {

    const [values, setValues] = useState({
        email: 'pepita@gmail.com',
        password: 'pepita1',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    const {email, password, error, loading, redirectToReferrer } = values
    const {user} = isAuthenticated()

    /*higher order function:
    a function that does one or both of the following:
    -takes one or more functions as arguments
    -returns a function as its result
    */
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        //prevent the browser reload the page after the submit
        event.preventDefault()
        setValues({...values, error: false, loading: true})
        signin({email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                   authenticate(data, ()=>{
                    setValues({
                        ...values,                                              
                        loading: false,
                        redirectToReferrer: true
                    })
                   })
                }

            })
    };

   

    const signInForm = () => (
        <form>
            
            <div className="from-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    value={email}
                />

            </div>

            <div className="from-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    value={password}
                />

            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    )

    const showError = () => (error ? <div className="alert alert-danger">
        {error}
    </div> : '')

    const showLoading = () => (loading && (<div className="alert alert-info">
            <h2>Loading...</h2>
    </div>) )

    const redirectUser = () =>{
        if(redirectToReferrer){
           if(user && user.role ===1){
            return <Redirect to="/admin/dashboard"/>
           }else{
            return <Redirect to="/user/dashboard"/>
           }
        }
        if(isAuthenticated()){
            return <Redirect to="/"/>
        }
    }
    


    return (
        <Layout title="Signin" description="Signin to Node React E-commerce App"
            className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}
            {JSON.stringify(values)}
        </Layout>)
}




export default Signin;