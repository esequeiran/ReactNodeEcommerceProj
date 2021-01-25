const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const errorHandler = require('../helpers/dbErrorHandler');


exports.productById = (req,res, next, id)=>{

    Product.findById(id)
    .populate("category")
    .exec((err, product)=>{
        if(err || !product){
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });    
};

exports.read = (req, res)=>{
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.create = (req,res)=>{

    //we use formidable because the req comes with the form-data body format, in the request
    //in header you don't have to specified the content-type as application json
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        //check for all fields
        const {name, description, price, category, quantity, shipping} = fields;
        if(
            !name || 
            !description || 
            !price || 
            !category || 
            !quantity || 
            !shipping
        ){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields);

        //1 kb = 1000, 1mb = 1000000, size of the file photo
        if(files.photo){
            if(files.photo.size > 1000000){
                return res.json({
                    error: 'Image should be less than 1mb in size'
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result)=>{
            if(err){
                res.status(400).json({
                    error: errorHandler
                });
            }

            res.json(result);
        })
    })

}

exports.remove = (req, res) => {
    let product = req.product

    product.remove((err, deletedProduct) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({            
            message : 'Product deleted successfully'
        })
    })
}

exports.update = (req,res)=>{

    //we use formidable because the req comes with the form-data body format, in the request
    //in header you don't have to specified the content-type as application json
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        //check for all fields
        // const {name, description, price, category, quantity, shipping} = fields;
        // if(
        //     !name || 
        //     !description || 
        //     !price || 
        //     !category || 
        //     !quantity || 
        //     !shipping
        // ){
        //     return res.status(400).json({
        //         error: 'All fields are required'
        //     });
        // }

        let product = req.product;

        /*lodash method let you update
        Arguments of _.extend:
        -origin product
        -fields the will be updated*/
        product = _.extend(product, fields)

        

        //1 kb = 1000, 1mb = 1000000, size of the file photo
        if(files.photo){
            if(files.photo.size > 1000000){
                return res.json({
                    error: 'Image should be less than 1mb in size'
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result)=>{
            if(err){
                res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json({
                result
            });
        })
    })

}

/**Return products based on:
 * sell / arrival
 * by sell = get some parameters /products?sortBy=sold&order=desc&limit=4 by example
 * by arrival = get some parameters /products?sortBy=createdAt&order=desc&limit=4 by example
 * if no params are sent, then all products are returned
 */
 exports.list = (req,res)=>{
     let order = req.query.order ? req.query.order : 'asc';
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
     let limit = req.query.limit ? parseInt(req.query.limit) : 6;

     Product.find()
            //we dont want to return the photo attribute
            .select("-photo")
            //takes the reference from the product document to get the category document in the attribute
            .populate("category")
            //takes array of array to sort the documents
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, products)=>{
                if(err) {
                    res.status(400).json({
                        error: "Products not found"
                    })
                }
                res.json(products)
            })
 }

 /**
  * it will find the products based on the req product category
  * other products that has the same category, will be returned
  */
 exports.listRelated = (req, res)=>{
    let limit = req.query.limit ? req.query.limit : 6

    //not including the req product, based on the category of the product
    Product.find({_id: {$ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", '_id name')
    .exec((err, products)=>{
        if(err) {
            res.status(400).json({
                error: "Products not found"
            })
        }
        res.json(products)
    })
 }

 exports.listCategories = (req, res)=>{
     //get all the category of the existing products
    Product.distinct("category", {}, (err,categories)=>{
        if(err) {
            res.status(400).json({
                error: "Products not found"
            })
        }
        res.json(categories);
    })

 }


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res)=>{
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.listSearch = (req, res) =>{
    //create query object to hold search value and category value
    const query = {};
    //assign search value to query.name
    if(req.query.search){
        //i is case insensitive, regex provide regular expression to strings and query
        query.name = {$regex: req.query.search, $options: 'i'}
        //assign category value to query.category
        if(req.query.category && req.query.category != 'All'){
            query.category = req.query.category
        }
        //find the product based on query object with 2 properties
        //search and category
        Product.find(query,(err, products)=>{
            if(err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select('-photo')
    }

    
}

exports.decreaseQuantity = (req, res, next)=>{
    let bulkOps = req.body.order.products.map((item)=>{
        return{
            updateOne: {
                filter: {_id: item._id},
                update:{
                    $inc:{quantity: -item.count, sold: +item.count}
                }
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (error, products)=>{
        if(error){
            return res.status(400).json({
                error: 'Could not update product'
            })
        }
        next();
    })
}
