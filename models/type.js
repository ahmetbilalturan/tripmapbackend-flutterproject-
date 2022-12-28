var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const sequencing = require('../config/sequencing');

var typeSchema = new Schema({
    _id: Number,
    typeName:{
        type: String,
        require: true,
    }
})

typeSchema.pre('save', function(next){
    var type = this;
    sequencing.getSequenceNextValue("type_id").then(counter =>{
        if(!counter){
            sequencing.insertCounter("type_id").then(counter => {
                type._id = counter;
                next();
            }).catch(error => next(error))
        }else{
            type._id = counter;
            next();
        }
    }).catch(error=> next(error))
})

module.exports = mongoose.model('Type', typeSchema)