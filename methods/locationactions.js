var Location = require('../models/location')
var District = require('../models/district')
var Type = require('../models/type')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var MongoClient = require('mongodb').MongoClient;
const { default: mongoose } = require('mongoose')
const { MongoUnexpectedServerResponseError } = require('mongodb')
var url = "mongodb+srv://AhmetBilalTuran:Ab!159357!Ab@cluster0.zujm3.mongodb.net/mydatabase?retryWrites=true&w=majority";

var functions ={
    addNew: function(req, res){
        if((!req.body.locationtypeId)|| (!req.body.locationdistrictId)||(!req.body.locationname)||(!req.body.locationimageurl)||(!req.body.locationdefination)||(!req.body.locationcoordinate)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }
        else{
            District.exists({_id: req.body.locationdistrictId},function(err, district){
                if(err) throw err;
                if(district){
                    Type.exists({_id: req.body.locationtypeId}, function(err, type){
                        if(err) throw err;
                        if(type){
                            var newLocation = Location({
                                locationTypeId: req.body.locationtypeId,
                                locationDistrictId: req.body.locationdistrictId,
                                locationName: req.body.locationname,
                                locationImageUrl: req.body.locationimageurl,
                                locationDefination: req.body.locationdefination,
                                locationCoordinate: req.body.locationcoordinate,
                                locationAvarageRating: 0
                            })
                            newLocation.save(function(err){
                                if(err) throw err;
                                Location.count({locationDistrictId: req.body.locationdistrictId}, function(err, count){
                                    if(err) throw err;
                                    District.findOneAndUpdate({_id: req.body.locationdistrictId}, {districtLocationCount: count}, function(err,district){
                                        if(err) throw err;
                                        res.json({success: true, msg: 'Lokasyon başarıyla kaydedilmiştir'})
                                        })
                                })
                            })
                        }
                        else{
                            res.json({success:false, msg: 'Tip bulunamadı'})
                        }
                    })
                    
                }else{
                    res.json({success:false, msg: 'Semt Bulunamadı'})
                }
            })
        }
    },
    findlocation: function(req, res){
        if((!req.body.locationdistrictId)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            Location.find({locationDistrictId: req.body.locationdistrictId}, function(err, locations){
                if(err) throw err;
                if(!locations){
                    res.json({success: false, msg: 'İstenilen kriterde lokasyon bulunmamaktadır'})
                }else{
                    res.json({success: true, 'array': locations})
                }
            }) 
        }
    },

    getalllocations: function(req, res){
        Location.find(function(err, locations){
            if(err) throw err;
            res.json({success: true, 'array': locations})
        })
    },

    getonefromlocations: function(req, res){
        if(!req.body.locationId){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            Location.findOne({_id: req.body.locationId}, function(err, location){
                if(err) throw err;
                if(!location){
                    res.json({success: false, msg: 'İstenilen kriterde lokasyon bulunmamaktadır'})
                }else{
                    res.json({success: true, 'location': location})
                }
            })
        }
    },

    getlocationidfromname: function(req,res){
        if(!req.body.locationname){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            Location.findOne({locationName: req.body.locationname}, function(err, location){
                if(err) throw err
                if(!location){
                    res.json({success: false, msg: 'İstenilen kriterde lokasyon bulunmamaktadır'})
                }else{
                    res.json({success: true, 'locationid': location._id})
                }
            })
        }
    }

}

module.exports = functions