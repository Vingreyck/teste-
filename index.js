const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())

const orderRoutes = require('./routes/orderRoutes')
app.use('/order', orderRoutes)

// rota pra testar
app.get('/', (req, res) => {
    res.json({message: 'API de pedidos funcionando'})
})

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/orders_db'

mongoose.connect(MONGO_URI).then(() => {
    console.log('conectou no mongodb')
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('servidor rodando na porta ' + PORT)
    })
}).catch((err) => {
    console.log('erro ao conectar no banco: ', err)
})
