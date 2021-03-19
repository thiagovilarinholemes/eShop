const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();


/**
 * Método GET
 */
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }

    res.status(200).send(categoryList); // Envia resposta
})

/**
 * Método GET por ID
 */
router.get('/:id', async (req, res) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(500).json({ message: 'Não existe categoria com esse ID!' });
    }
    res.status(200).send(category);
})

/**
 * Método Put
 */
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {new: true} // Retorna os novos dados atualizados
    )
    if (!category) {
        return res.status(500).send('A categoria não pode ser atualizada!');
    } else {
        res.send(category)
    }
})

/**
 * Método Post
 */
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if (!category) {
        return res.status(500).send('A categoria não pode ser criada!');
    } else {
        res.send(category)
    }
})

/**
* Método Deletar
*/
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({ success: true, message: 'Categoria deletada com sucesso!' })
            }
            else {
                return res.status(404).json({ success: false, message: 'Categoria não encontrada!' })
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: `Ocorreu um erro na requisição`, message: err })
        })
})

module.exports = router;