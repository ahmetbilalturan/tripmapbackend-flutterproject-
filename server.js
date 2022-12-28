const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const passport = require('passport')
const bodyParser = require('body-parser')
const routes = require('./routes/index')

connectDB()


const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(routes) 
app.use(passport.initialize())
app.use('/profilepictures', express.static(__dirname +'/profilepictures'));
require('./config/passport')(passport) 

const PORT = process.env.PORT || 5554

app.listen(PORT, console.log('Server runnning in ' +process.env.NODE_ENV+' mode on port '+PORT))