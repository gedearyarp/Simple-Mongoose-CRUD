import mongoose from 'mongoose';

const Laptop = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : String,
    RAM : Number,
    price : Number,
    processor : String,
})

// Collection inside the database
export default mongoose.model('laptopList', Laptop)