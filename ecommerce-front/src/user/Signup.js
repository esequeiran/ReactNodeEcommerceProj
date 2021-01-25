import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import Layout from '../core/Layout'
import {signup} from '../auth'

const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    const { name, email, password, error, success } = values

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
        setValues({...values, error: false})
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false })
                } else {
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true
                    })
                }

            })
    };

   

    const signUpForm = () => (
        <form>
            <div className="from-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    value={name}
                />

            </div>

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

    const showSuccess = () => (success ? <div className="alert alert-info">
    New account has been created. Please <Link to="/signin">Signin</Link>
    </div> : '')
    


    return (
        <Layout title="Signup" description="Signup to Node React E-commerce App"
            className="container col-md-8 offset-md-2">
            {showSuccess()}
            {showError()}
            {signUpForm()}
            {JSON.stringify(values)}
        </Layout>)
}




export default Signup;