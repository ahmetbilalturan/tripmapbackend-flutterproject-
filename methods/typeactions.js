var Type = require('../models/type')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var MongoClient = require('mongodb').MongoClient;
const { default: mongoose, Types } = require('mongoose')
const { MongoUnexpectedServerResponseError } = require('mongodb')
var url = "mongodb+srv://AhmetBilalTuran:Ab!159357!Ab@cluster0.zujm3.mongodb.net/mydatabase?retryWrites=true&w=majority";

var functions ={
    addNew: function(req,res){
        if(!req.body.typename){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            newType = Type({
                typeName: req.body.typename
            })
            newType.save(function(err){
                if(err){
                    res.json({success: false, msg: 'Kayıt Başarısız'})
                }
                else{
                    res.json({success: true, msg: 'Başarıyla Kaydolundu'})
                }
            })
        }
    },
    gettypes: function(req,res){
        Type.find(function(err, types){
            if(err)throw err;
            res.json({success: true, "array": types})
        })
    }
}

module.exports = functions