const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")

app.use(express.json());
app.use(cors());

// product schema design 
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product.."],
        trim: true, // space thakbena (age + pore)
        minLength: [3, "Name must be at least 3 characters"],
        unique: [true, "Product name must be unique"],
        maxLength: [100, "Name must be within 100 characters"]
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price can't be negetive."]
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "pcs", "litre"], //enum predefined word golo k rekhe dey
            message: "Unit must be kg, pcs, or litre"
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity can't be negetive"],
        //custom validate any property
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value)
                if (isInteger) {
                    return true
                } else {
                    return false
                }
            },
            message: "Quantity must be integer number.."
        }
    },
    status: {
        type: String,
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "Status can't be {VALUE}"
        },
    },


    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt:{
    //     type: Date, 
    //     default: Date.now
    // }

    // we can use these feaute by mongodb timestamps 


    // supplier: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Supplier"
    // },
    // categories: [{
    //     name: {
    //         type: String,
    //         required: true,
    //     },
    //     _id: mongoose.Schema.Types.ObjectId

    // }]


}, {
    // here mongoose option proporty 
    timestamps: true
})


// mongoose middeware for saving data >> pre / post

// schemaname.middeearename("method name", normal function)

productSchema.pre('save', function (next) {
    if (this.quantity == 0) {
        this.status = "out-of-stock"
    }
    console.log("Before save the data")
    next()
})

productSchema.post('save', function (doc, next) {
    console.log("After saving the dataa")
    console.log(doc)
    next()
})

// you can create an instance 

productSchema.methods.logger = function () {
    console.log(`product save successfully with name ${this.name}`)
}

// how to make a model 
// mongoose follows ... Schema >> Model >> Query 
// make a model 
const Product = mongoose.model('Product', productSchema)

// to do query (save a product)
app.post("/api/v1/product", async (req, res, next) => {
    try {
        // we can save data in two way  1. save or 2. create
        // now we are going to se save method 
        //instance creation >> do something >> save()
        const product = new Product(req.body)
        if (product.quantity == 0) { //we can more validate here(save() method is better)
            product.status = "out-of-stock"
        }
        const result = await product.save()
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
})

// get products 

app.get("/api/v1/product", async (req, res, next) => {
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
        const result = await Product.findById("646b056ddd4ab3ba4cbdd785")

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
})




app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});




module.exports = app;