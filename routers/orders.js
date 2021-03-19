const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * Método GET
 */
router.get(`/`, async (req, res) => {
    
    const orderList = await Order.find()
        .populate('user', 'name') //preenche somente o nome
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'}
            }) 
        .sort({'dateOrdered': -1}); // sort({'dateOrdered': -1}) ordena em data decrescente

    if (!orderList) {
        res.status(500).json({ success: false })
    }

    res.status(200).send(orderList); // Envia resposta
})

/**
 * Método GET por ID
 */
router.get(`/:id`, async (req, res) => {
    // Em populate('user', 'name'), preenche somente o nome, e em sort({'dateOrdered': -1}) ordena em data decrescente
    const order = await Order.findById(req.params.id).populate('user', 'name').sort({'dateOrdered': -1}); 

    if (!order) {
        res.status(500).json({ success: false })
    }

    res.status(200).send(order); // Envia resposta
})

/**
 * Método Post
 */
router.post('/', async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);


    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    
    order = await order.save();

    if (!order) {
        return res.status(500).send('A ordem de compra não pode ser criada!');
    } else {
        res.send(order)
    }
})

/**
 * Método Put
 */
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        {new: true} // Retorna os novos dados atualizados
    )
    if (!order) {
        return res.status(500).send('A ordem de compra não pode ser atualizada!');
    } else {
        res.send(order)
    }
})

/**
* Método Deletar
*/
router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'Ordem de compra deletada com sucesso!'})
        } else {
            return res.status(404).json({success: false , message: "A Ordem de compra não foi encontrada!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

/**
 * Método Valor Total de Vendas
 */
router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

/**
 * Método Total de Vendas
 */
router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count) // Conta o número de orders, que é o número de vendas

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

/**
 * Método Total de Vendas por Usuario
 */
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})
module.exports = router