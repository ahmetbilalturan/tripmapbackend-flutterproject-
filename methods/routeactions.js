var Route = require('../models/route');
var User = require('../models/user');
var Location = require('../models/location')

var functions ={
    getroutes: function(req,res){
       if(!req.body.userid){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
       }else{
        Route.find({routeUserId: req.body.userid}, function(err, routes){
            if(err) throw err;
            res.json({success: true, 'array': routes})
        })
       }
    },

    addtoroutes: function(req,res){
        if((!req.body.userid)|| (!req.body.routelocationname)){
            res.json({success: false, msg: 'Bütün Boşlukları Doldurunuz'})
        }else{
            User.findOne({_id: req.body.userid}, function(err, user){
                if(err) throw err;
                if(!user){
                    res.json({success: false, msg: 'böyle bir kullanıcı bulunmamakta'})
                }else{
                    Location.findOne({locationName: req.body.routelocationname}, function(err, location){
                        if(err) throw err
                        if(!location){
                            res.json({success: false, msg: 'böyle bir lokasyon bulunmamakta'})
                        }
                        else{
                            var newRoute = Route({
                                routeUserId: req.body.userid,
                                routeLocations: req.body.routelocationname,
                                routeDate: new Date().toLocaleString('tr-TR', {timeZone: 'Europe/Istanbul'})
                            })
                            newRoute.save(function(err){
                                if(err) throw err
                            })
                            res.json({success: true, msg: 'Rota başarıyla kaydedildi'})
                        }
                    })
                }
            })
            
        }
    }
}

module.exports = functions