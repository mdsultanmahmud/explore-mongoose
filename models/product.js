const mongoose = require("mongoose")

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

module.exports = Product
