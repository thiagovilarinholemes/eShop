const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs') // Para excluir imagem

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}
/**
 * Upload de arquivos
 * Sempre a função de upload deve vir acima das demais funções de rota
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]; // Tipos de arquivos validos
        let uploadError = new Error('Extensão de arquivo invalido!'); // Mensagem de erro de arquivo invalido

        if(isValid){
            uploadError = null;
        }

        cb(uploadError, 'public/uploads') // Diretório de destino do upload e caso o arquivo não possua a extensão declarada em FILE_TYPE_MAP exibe a mensagem de erro
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype]; // file.mimetype é a chave em FILE_TYPE_MAP 'image/png'
        cb(null, `${fileName}-${Date.now()}.${extension}`) // Cria o nome do arquivo
    }
})

const uploadOptions = multer({ storage: storage })


/**
 * Método GET ALL
 */
// router.get(`/`, async (req, res) => {
//     const productList = await Product.find().select('name image category _id').populate('category'); // Seleciona os campos desejados e em -_id remove o campo _id

//     if (!productList) {
//         res.status(500).json({ success: false })
//     }

//     res.send(productList); // Envia resposta
// })

/**
 * Método GET ID
 */
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category'); // Retorna os dados das relações entre as coleções

    if (!product) {
        res.status(500).json({ success: false })
    }

    res.send(product); // Envia resposta
})

/**
 * Método POST
 */
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    // Validando a categoria
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Categoria invalida!')
    }

    const file = req.file;
    if(!file){
        return res.status(400).send('Carregue uma imagem!')
    }

    // Capturando o endereço do arquivo
    const fileName = req.file.filename

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/` // req.protocol = http, host = localhost:3000

    // Criando o objeto a ser salvo no banco de dados
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

    })

    // Salvando no banco de dados
    product = await product.save();


    if (!product) {
        return res.status(400).send('The product cannot be created')
    }
    return res.status(200).send(product);
})

/**
 * Método Put
 */
router.put('/:id', async (req, res) => {
    // Validando ID
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('ID do produto invalido!')
    }
    // Validando a categoria
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Categoria invalida!')
    }

    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true } // Retorna os novos dados atualizados
    )
    if (!product) {
        return res.status(500).send('O produto não pode ser atualizado!');
    } else {
        res.send(product)
    }
})

/**
* Método Deletar
*/
router.delete('/:id', async(req, res) => {
    await imgDelete(req.params.id)

    await Product.findByIdAndRemove(req.params.id)
        
        .then(product => {
            
            if (product) {
                
                return res.status(200).json({ success: true, message: 'Produto deletada com sucesso!' })
            }
            else {
                return res.status(404).json({ success: false, message: 'Produto não encontrado!' })
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: `Ocorreu um erro na requisição`, message: err })
        })
})

/**
 * Função para Excluir imagem principal e as secundarias
 */
const  imgDelete = async(id) =>{
    const imgs =  await Product.findById(id)
        .then(product => {
            
            const aux = product.image.replace('http://localhost:3000/public/uploads/','')
            fs.unlinkSync(`./public/uploads/${aux}`)

            const ims = product.images.slice()
            ims.map(im => {
                const aux = im.replace('http://localhost:3000/public/uploads/','')
                fs.unlinkSync(`./public/uploads/${aux}`)
            })

            // if(product.image){
            //     const aux = product.image.replace('http://localhost:3000/public/uploads/','')
                
            //     try {
            //         fs.unlinkSync(`./public/uploads/${aux}`)
            //     } catch (error) {
            //         console.log(error)
            //     }
            // }else{
            //     console.log('Não foi possível excluir a imagem!')
            // }

            // /** -------- */

            // if(product.images){
            //     const ims = product.images.slice()
            //     ims.map(im => {
            //         fs.unlinkSync(`./public/uploads/${im}`)
            //     })
            // }
        })
        .catch(err => null)
}
/**
 * Método GET COUNT Products - conta quantos tipos de produtos estão cadastrados
 */
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false })
    }

    res.send({ count: productCount }); // Envia resposta
})

/**
 * Método GET FEATURED Products - retorna os produtos que estão com o campo isFeature true
 */
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0 // Pega o valor limite passado na URL

    const products = await Product.find({ isFeatured: true }).limit(+count); // Limita o número de itens, o sinal + converte string para inteiro 

    if (!products) {
        res.status(500).json({ success: false })
    }

    res.send(products); // Envia resposta
})

/**
 * Método GET por Parametros e por todos os produtos
 * http://localhost/api/v1/products?categories=111,222,333 - busca por categoria
 * http://localhost/api/v1/products - busca todos os produtos
 */
router.get(`/`, async (req, res) => {
    // http://localhost:3000/api/v1/products?categories=2342342,234234
    // http://localhost:3000/api/vi/products?categories=60512996b1f19321f94f1f2d,6050f70da2e59a24749d8ad9
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }

    const productList = await Product.find(filter).select('name category image images').populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})

/**
 * Método Put Galeria de Imagens
 */
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), // Máximo de uploda 10 arquivos
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

module.exports = router;



// const path = './file.txt'

