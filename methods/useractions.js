var User = require('../models/user')
var Location = require('../models/location')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var bcrypt = require('bcrypt');

var functions ={
    addNew: function(req,res){
        if((!req.body.username) || (!req.body.password) || (!req.body.email) || (!req.body.fullname)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }
        else{
            User.findOne({
                username: req.body.username,
            }, function (err,user){
                if(err) throw err
                if(!user){
                    User.findOne({
                        email: req.body.email
                    }, function(err,user){
                        if(err) throw err
                        if(!user){
                            var newUser = User({
                                fullname: req.body.fullname,
                                username: req.body.username,
                                password: req.body.password,
                                email: req.body.email,
                                profilepicture: '',
                                bookmarks: Array,

                            });
                            newUser.save(function(err, newUser){
                                if(err){
                                    throw err;
                                    //res.json({success: false, msg: 'Kayıt Başarısız'})
                                }
                                else{
                                    res.json({success: true, msg: 'Başarıyla Kaydolundu'})
                                }
                            })
                        }else{
                            res.status(200).send({success: false, msg: 'Bu email kullanılmakta'})
                        }
                    })
                    
                }else{
                    res.status(200).send({success: false, msg: 'Bu kullanıcı adı kullanılmakta'})
                }
            })
            
        }
    },
    login: function (req,res){
        if((!req.body.username)|| (!req.body.password)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            User.findOne({
                username: req.body.username
            }, function(err, user){
                if(err) throw err
                if(!user){
                    res.status(200).send({success: false, msg: 'Giriş Başarısız, Kullanıcı Adı veya Şifre Yanlış'})
                }
                else{
                    user.comparePassword(req.body.password, function(err, isMatch){
                        if(isMatch && !err){
                            var token = jwt.encode(user, config.secret)
                            res.json({success: true, token: token, msg: 'Giriş Başarılı'})
                        }
                        else{
                            return res.status(200).send({success: false, msg: 'Giriş Başarısız, Kullanıcı Adı veya Şifre Yanlış'})
                        }
                    })
                }
            }
            )
        }
        
    },

    getusernamefromid: function(req,res){
        if(!req.body.userid){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            User.findOne({_id: req.body.userid}, function(err, user){
                if(err) throw err
                if(!user){
                    res.json({success: false, msg: 'Kullanıcı Bulunamadı'})
                }else{
                    res.json({success: true, 'username': user.username})
                }
            })
        }
    },

    changeusername: function(req,res){
        if((!req.body.userid)||(!req.body.username)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            User.findOneAndUpdate({_id: req.body.userid},{username: req.body.username}, function(err){
                if (err) throw err
                res.json({success: true, msg: 'Kullanıcı adı başarıyla değiştirilmiştir'})
            })
        }
    },

    changepassword: function(req, res){
        if((!req.body.userid)||(!req.body.password)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            bcrypt.genSalt(10, function(err,salt){
                if (err) throw err;
                bcrypt.hash(req.body.password, salt, function(err, hash){
                    if(err) throw err;
                    User.findOneAndUpdate({_id: req.body.userid}, {password: hash})
                })
            })
            
        }
    },
    getinfo: function(req,res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'hello ' + decodedtoken.username, "userid": decodedtoken._id, "username": decodedtoken.username,"fullname": decodedtoken.fullname, "email": decodedtoken.email, 'profilepicture': 
            decodedtoken.profilepicture})
        }else{
            return res.json({success: false, msg: 'no headers'})
        }
    },

    getbookmarks: function(req,res){
        if(!req.body.userid){
            res.json({success: false, msg: 'lütfen bütün boşlukları doldurunuz'})
        }else{
            User.findOne({_id: parseInt(req.body.userid)}, function(err, user){
                if (err) throw err;
                if(!user){
                    res.json({success: false, msg: 'Kullanıcı bulunamadı'})
                }else{
                    res.json({success: true, 'array': user.bookmarks})
                }
            })
        }
    },

    addtobookmarks:function(req,res){
        if((!req.body.userid) || (!req.body.locationId)){
            res.json({success: false, msg: 'lütfen bütün boşlukları doldurunuz'})
        }
        else{
            Location.findOne({_id: parseInt(req.body.locationId)}, function(err, location){
                if(!location){
                    res.json({success: false, msg: 'Böyle bir lokasyon bulunmamaktadır'})
                }else{
                    User.findOneAndUpdate({_id: parseInt(req.body.userid)},{$push:{bookmarks: parseInt(req.body.locationId)}} ,function(err, user){
                        if(err) throw err
                        res.json({success: true, msg: 'Başarıyla eklenmiştir'})
                    })
                }
            })
          
        }
    },

    checkifitsinbookmarks: function(req,res){
        if((!req.body.userid) || (!req.body.locationId)){
            res.json({success: false, msg: 'lütfen bütün boşlukları doldurunuz'})
        }else{
            User.findOne({_id: parseInt(req.body.userid)}, function(err, user){
                if(err) throw err;
                if(!user){
                    res.json({success: false, msg: 'Böyle bir lokasyon bulunmamaktadır'})
                }else{
                    if(user.bookmarks.includes(parseInt(req.body.locationId))){
                        res.json({success: true, 'condition': true})
                    }else{
                        res.json({success: true, 'condition': false})
                    }
                }
            })
        }
    },
    
    removefrombookmarks: function(req,res){
        if((!req.body.userid) || (!req.body.locationId)){
            res.json({success: false, msg: 'lütfen bütün boşlukları doldurunuz'})
        }
        else{
            Location.findOne({_id: parseInt(req.body.locationId)}, function(err, location){
                if(!location){
                    res.json({success: false, msg: 'Böyle bir lokasyon bulunmamaktadır'})
                }else{
                    User.findOneAndUpdate({_id: parseInt(req.body.userid)},{$pull:{bookmarks: parseInt(req.body.locationId)}} ,function(err, user){
                        if(err) throw err
                        res.json({success: true, msg: 'Başarıyla kaldırılmıştır'})
                    })
                }
            })
          
        }
    }
}

module.exports = functions