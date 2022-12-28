var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const sequencing = require('../config/sequencing');

var districtSchema = new Schema({
    _id: Number,
    districtName:{
        type: String,
        require: true
    },
    districtImageUrl:{
        type: String,
        require: true,
    },
    districtLocationCount:{
        type: Number,
        require: true,
    },
    districtAvarageRating:{
        type: Number,
        require: true,
    }
})

districtSchema.pre('save', function(next){
    var district = this;
    sequencing.getSequenceNextValue("district_id").then(counter =>{
        if(!counter){
            sequencing.insertCounter("district_id").then(counter => {
                district._id = counter;
                next();
            }).catch(error => next(error))
        }else{
            district._id = counter;
            next();
        }
    }).catch(error=> next(error))
})

const getLocationCountSequenceNextValue = (districtID) => {
    return new Promise((resolve, reject) => {
        Counter.findByIdAndUpdate(
            {"_id": districtID},
            (error,district) => {
                if (error){
                    reject(error);
                }
                if(counter){
                    resolve(district.districtLocationCount + 1);
                } else{
                    resolve(null)
                }
            }
        )
    })
};

module.exports = mongoose.model('District', districtSchema)