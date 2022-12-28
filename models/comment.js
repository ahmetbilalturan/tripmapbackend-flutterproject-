var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const sequencing = require('../config/sequencing');

var commentSchema = new Schema({
    _id: Number,
    commentUserId:{
        type: Number,
        require: true,
    },
    commentLocationId:{
        type: Number,
        require: true,
    },
    commentRating:{
        type: Number,
        require: true,
    },
    commentContent:{
        type: String,
        require: true,
    },
    commentDate:{
        type: String,
        require: true,
    }
})

commentSchema.pre('save', function(next){
    var comment = this;
    sequencing.getSequenceNextValue("comment_id").then(counter =>{
        if(!counter){
            sequencing.insertCounter("comment_id").then(counter => {
                comment._id = counter;
                next();
            }).catch(error => next(error))
        }else{
            comment._id = counter;
            next();
        }
    }).catch(error=> next(error))
})

module.exports = mongoose.model('Comment', commentSchema)