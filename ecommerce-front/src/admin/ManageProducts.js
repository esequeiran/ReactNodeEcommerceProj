import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import {getProducts, deleteProduct} from './apiAdmin'

const ManageProducts = () =>{

    const [products, setProducts] = useState([]);

    const loadProducts = () =>{
        getProducts().then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setProducts(data)
            }
        })
    }

    const {token, user} = isAuthenticated();

    const destroy = (productId) =>{
        deleteProduct(productId, user._id, token ).then(
            data=>{
                if(data.error){
                    console.log(data.error)
                }else{
                    loadProducts();
                }
            }
        )
    }

    useEffect(()=>{
        loadProducts();
    }, [])


    

    return (
        <Layout 
        title="Manage products" 
        description="Perform CRUD on products "
        className="container-fluid"
        >
          <div className="row">
            <div className="col-12">
                <h2 className="text-center">
                    Total {products.length} products
                </h2>
                <hr/>
                <ul className="list-group">
                {products.map((p, i)=>(
                        <li 
                        className="list-group-item d-flex justify-content-between
                        align-items-center"
                        key={i}
                        >
                            <strong>{p.name}</strong>
                            <Link to={`/admin/product/update/${p._id}`}>
                                <span
                                className="badge badge-warning badge-pill"
                                >
                                    Update
                                </span>
                            </Link>
                            <span 
                            className="badge badge-danger badge-pill"
                            onClick={()=>destroy(p._id)}
                            >
                                Delete    
                            </span>    
                        </li>
                        
                ))}
                </ul>

            </div>
          </div>
          
        </Layout>)
}

export default ManageProducts;