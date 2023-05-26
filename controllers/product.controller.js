const Product = require("../models/product")
const productServices = require("../services/product.service")


// get all products 
module.exports.getProduct = async (req, res, next) => {
    try {
        // const result = await Product.find({})
        // load a single product 
        // const result = await Product.find({_id: "646b0cd343a56d338467f5a6", name: "Mobile"})
        // const result = await Product.find({$or: [{_id: "646b0cd343a56d338467f5a6"}, {name: "Laptop"}, {name: "Potato"}]})
        // const result = await Product.find({status: {$ne: "out-of-stock"}})
        // const result = await Product.find({status: {$eq: "out-of-stock"}})
        // const result = await Product.find({name: {$in: ["Mobile", "Laptop", "Orange"]}})

        // projection is very eassy in mongoose 
        // const result = await Product.find({}, 'name quantity unit')
        // const result = await Product.find({}, '-name -quantity -unit')
        // const result = await Product.find({}).select({name: 1, unit: 1})
        // const result = await Product.find({}).limit(3)
        // const result = await Product.find({}).sort({
        //     price: 1
        // })

        // mongoose provide us a better solution for qurying data 

        // const result = await Product
        // .where("name").equals(/\w/)
        // .where("price").gt(50).lt(1000)
        // .limit(2).sort({price: 1})

        // load a single product with id 
        // const result = await Product.findById("646b056ddd4ab3ba4cbdd785")
        const result = await productServices.getProductService()

        res.status(200).json({
            success: true,
            message: "Data find successfully",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: "Data inserted fail",
            data: error
        })
    }
}


// to do query (save a product)
module.exports.addProduct =async (req, res, next) => {
    try {
        // we can save data in two way  1. save or 2. create
        // now we are going to se save method 
        //instance creation >> do something >> save()
        // const product = new Product(req.body)
        // if (product.quantity == 0) { //we can more validate here(save() method is better)
        //     product.status = "out-of-stock"
        // }
        // const result = await product.save()
        const result = await productServices.addProductService(req.body)
        result.logger()

        // we can add a product with another method create 

        // const result = await Product.create(req.body) 
        res.status(200).json({
            success: true,
            message: `Product have saved.`,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: "Data inserted fail",
            data: error
        })
    }
}



