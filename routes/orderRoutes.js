const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

// funcao que transforma os dados do body pro formato do banco
function transformarDados(body) {
    
    let numeroPedido = body.numeroPedido
    // tirando o sufixo tipo "-01" do numero do pedido
    if(numeroPedido.includes('-')) {
        numeroPedido = numeroPedido.split('-')[0]
    }

    // mapping dos itens
    let items = []
    if(body.items) {
        for(let i = 0; i < body.items.length; i++) {
            items.push({
                productId: parseInt(body.items[i].idItem),
                quantity: body.items[i].quantidadeItem,
                price: body.items[i].valorItem
            })
        }
    }

    return {
        orderId: numeroPedido,
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao).toISOString(),
        items: items
    }
}


// criar pedido
router.post('/', async (req, res) => {
    try {
        const body = req.body

        if(!body.numeroPedido || !body.valorTotal || !body.dataCriacao) {
            return res.status(400).json({error: 'faltando campos obrigatorios'})
        }

        const dados = transformarDados(body)

        // vendo se ja existe
        const existe = await Order.findOne({orderId: dados.orderId})
        if(existe) {
            return res.status(409).json({error: 'pedido ja existe'})
        }

        const novoPedido = new Order(dados)
        const salvo = await novoPedido.save()

        res.status(201).json({message: 'pedido criado', data: salvo})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'erro no servidor'})
    }
})


// listar todos
// obs: tem que ficar antes do /:orderId senao o express confunde
router.get('/list', async (req, res) => {
    try {
        const pedidos = await Order.find()
        res.status(200).json({data: pedidos})
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'erro no servidor'})
    }
})


// buscar por id
router.get('/:orderId', async (req, res) => {
    try {
        const pedido = await Order.findOne({orderId: req.params.orderId})

        if(!pedido) {
            return res.status(404).json({error: 'pedido nao encontrado'})
        }

        res.status(200).json({data: pedido})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'erro no servidor'})
    }
})


// atualizar pedido
router.put('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId
        const body = req.body

        const pedido = await Order.findOne({orderId: orderId})
        if(!pedido) {
            return res.status(404).json({error: 'pedido nao encontrado'})
        }

        // atualizando os campos que vieram
        let update = {}
        if(body.valorTotal) update.value = body.valorTotal
        if(body.dataCriacao) update.creationDate = new Date(body.dataCriacao).toISOString()
        if(body.items) {
            update.items = []
            for(let i = 0; i < body.items.length; i++) {
                update.items.push({
                    productId: parseInt(body.items[i].idItem),
                    quantity: body.items[i].quantidadeItem,
                    price: body.items[i].valorItem
                })
            }
        }

        const atualizado = await Order.findOneAndUpdate(
            {orderId: orderId},
            update,
            {new: true}
        )

        res.status(200).json({message: 'pedido atualizado', data: atualizado})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'erro no servidor'})
    }
})


// deletar pedido
router.delete('/:orderId', async (req, res) => {
    try {
        const pedido = await Order.findOne({orderId: req.params.orderId})
        if(!pedido) {
            return res.status(404).json({error: 'pedido nao encontrado'})
        }

        await Order.deleteOne({orderId: req.params.orderId})
        res.status(200).json({message: 'pedido deletado'})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'erro no servidor'})
    }
})


module.exports = router
