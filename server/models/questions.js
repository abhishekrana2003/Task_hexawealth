const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true},
    tag: { type: String, required: true },
    isApproved: {type:Boolean,required:true},
    email:{type:String,required:true},
    likedBy: {type:[String],required:false}
});

module.exports = mongoose.model('Question', questionSchema);