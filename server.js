const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const path = require('path');

//connect to DB
connectDB();

//Init middleware
app.use(express.json({extended: false}))


//Define routers
app.use('/api/users', require('./sever/routes/api/users'))
app.use('/api/auth', require('./sever/routes/api/auth'))
app.use('/api/profile', require('./sever/routes/api/profile'))
app.use('/api/posts', require('./sever/routes/api/posts'))

//serve static assets in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })

}

app.listen(PORT, ()=> console.log(`server started on port: ${PORT}`))