var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const sequencing = require('../config/sequencing');

var routeSchema = new Schema({
    _id: Number,
    routeUserId:{
        type: Number,
        require: true,
    },
    routeDate:{
        type: String,
        require: true,
    },
    routeLocations:{
        type: String,
        require: true,
    },
})

routeSchema.pre('save', function(next){
    var route = this;
    sequencing.getSequenceNextValue("route_id").then(counter =>{
        if(!counter){
            sequencing.insertCounter("route_id").then(counter => {
                route._id = counter;
                next();
            }).catch(error => next(error))
        }else{
            route._id = counter;
            next();
        }
    }).catch(error=> next(error))
})

module.exports = mongoose.model('Route', routeSchema)