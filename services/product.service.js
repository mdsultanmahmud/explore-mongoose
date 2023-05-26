const Product = require("../models/product")

exports.getProductService = async () => {
    const products = await Product.find({})
    return products
}

exports.addProductService = async (data) => {
    const product = new Product(data)
    if (product.quantity == 0) { //we can more validate here(save() method is better)
        product.status = "out-of-stock"
    }
    const result = await product.save()
    return result
}