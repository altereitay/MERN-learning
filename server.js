const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')

//connect to DB
connectDB();

//Init middleware
app.use(express.json({extended: false}))

app.get('/', (req, res)=>{
    res.send('hello world')
})

//Define routers
app.use('/api/users', require('./sever/routes/api/users'))
app.use('/api/auth', require('./sever/routes/api/auth'))
app.use('/api/profile', require('./sever/routes/api/profile'))
app.use('/api/posts', require('./sever/routes/api/posts'))

app.listen(PORT, ()=> console.log(`server started on port: ${PORT}`))