const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Método GET
 */
router.get(`/`, async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        res.status(500).json({ success: false })
    }

    res.status(200).send(userList); // Envia resposta
})

/**
 * Método GET por ID
 */
router.get('/:id', async (req, res) => {
    let user = await User.findById(req.params.id).select('name email phone isAdmin');
    if (!user) {
        return res.status(500).json({ message: 'Não existe usuário com esse ID!' });
    }
    res.status(200).send(user);
})

/**
 * Método Post
 */
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10), // Criptografando a senha
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user) {
        return res.status(500).send('O usuário não pode ser criada!');
    } else {
        res.send(user)
    }
})

/**
 * Método Put
 */
router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('O usuário não pode ser atualizado!')

    res.send(user);
})

/**
 * Método Delete
 */
router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'Usuário deletado!'})
        } else {
            return res.status(404).json({success: false , message: "Usuário não encontrado!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

/**
 * Login - autenticação
 */
 router.post('/login', async(req, res) => {
    const secret = process.env.secret; // Busca a chave secreta no arquivo .env
    const user = await User.findOne({email: req.body.email}); // Verifica se existe o email enviado

    if(!user){ // Caso não exista retorna uma mensagem
        return res.status(400).send('Usuário não encontrado!');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){ // Veirificando a senha enviada
        const token = jwt.sign( // Gera o token
            { // Dados a serem enviados pelo token
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret, // Chave de criptografia que está no .env, foi declarada acima para buscar no arquivo .env
            {
                expiresIn: '1d' // Tempo de expiração do token
            }
        )

        return res.status(200).send({user: user.email, token: token}) // Retorna o email e o token gerado
    }else{ // Retorna caso a senha seja diferente a do banco de dados
        
        res.status(400).send('Senha invalida!')
    }
 })

 /**
 * Método de Contagem de usuário
 */
router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


module.exports = router