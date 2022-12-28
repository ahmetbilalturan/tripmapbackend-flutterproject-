var District = require('../models/district')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var MongoClient = require('mongodb').MongoClient;
const { default: mongoose } = require('mongoose')
const { MongoUnexpectedServerResponseError } = require('mongodb');
const { findOne } = require('../models/user');
var url = "mongodb+srv://AhmetBilalTuran:Ab!159357!Ab@cluster0.zujm3.mongodb.net/mydatabase?retryWrites=true&w=majority";

var functions={
    addNew: function(req,res){
        if((!req.body.districtname)||(!req.body.districtimageurl)){
            res.json({success:true, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            var newDistrict = District({
                districtName: req.body.districtname,
                districtImageUrl: req.body.districtimageurl,
                districtLocationCount: 0,
                districtAvarageRating: 0, 
            })
            newDistrict.save(function(err){
                if(err) throw err;
                res.json({success: true, msg: 'Başarıyla kaydedilmiştir'})
            })
        }
    },
    getdistricts: function(req, res){
        District.find(function(err,districts){
            if(err)throw err;
            res.json({success: true, "array": districts})
        })
    }
}

 module.exports = functions

