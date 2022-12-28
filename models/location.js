const { Double } = require('mongodb');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const sequencing = require('../config/sequencing');

var locationSchema = new Schema({
    _id: Number,
    locationTypeId:{
        type: Number,
        require: true,
    },
    locationDistrictId:{
        type: Number,
        require: true,
    },
    locationName:{
        type: String,
        require: true,
    },
    locationImageUrl:{
        type: [String],
        require: true,
    },
    locationDefination:{
        type: String,
        require: true,
    },
    locationCoordinate:{
        type: String,
        require: true
    },
    locationAvarageRating:{
        type: Number,
        require: true,
    }
})

locationSchema.pre('save', function(next){
    var location = this;
    sequencing.getSequenceNextValue("location_id").
                then(counter => {
                    if(!counter){
                        sequencing.insertCounter("location_id")
                        .then(counter =>{
                            location._id = counter;
                            next();
                        })
                        .catch(error => next(error))
                    }else{
                        location._id = counter;
                        next();
                    }
                })
                .catch(error => next(error))
})

module.exports = mongoose.model('Location', locationSchema)