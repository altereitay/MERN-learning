const mongoose = require('mongoose')
const config = require('config')
const DB = config.get('mongoURI')

const connectDB = async () => {
    try{
       await mongoose.connect(DB, {
           useNewUrlParser:true
       })
        console.log('connected to mongo')
    }catch (e) {
        console.error(e.message)
        //Exit process on fail
        process.exit(1)
    }
}

module.exports = connectDB