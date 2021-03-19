const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
require('dotenv/config');
const errorHandler = require('./helpers/error-handler')
/**
 * Método Cors, deve ser inserido antes de tudo
 */
app.use(cors());
app.options('*', cors())
const api = process.env.API_URL;
/**
 * Define uma rota estatica, qualquer arquivo pode ser carregado nele, não sendo um caminho, mas é necessário liberar no jwt.js
 * Deve ser setada aqui
 */
app.use('/public/uploads', express.static(__dirname + '/public/uploads')); 

/**
 * Configuração do body-parser para receber
 * dados json
 */
// Middleware
app.use(morgan('dev')) // dev é como será mostrado no console
app.use(bodyParser.json());
app.use(authJwt());
app.use(errorHandler);

/**
 * Configuração da biblioteca dotenv
 * Em API_URL é o nome da variável no 
 * arquivo .env
 */
// Constants
const productsRouters = require('./routers/products');
const categoriesRouters = require('./routers/category');
const usersRouters = require('./routers/user');
const ordersRouters = require('./routers/orders');

/**
 * Routers
 */
app.use(`${api}/products`, productsRouters);
app.use(`${api}/categories`, categoriesRouters);
app.use(`${api}/users`, usersRouters);
app.use(`${api}/orders`, ordersRouters);

/**
 * Configuração d MongoDB
 */
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eShop-database'
    }
)
    .then(() => {
        console.log('Database connection success!!!')
    })
    .catch((err) => {
        console.log(`ERROR: ${err}`)
    })

app.listen(3000, () => {
    console.log('Running port 3000... \\(^_^)/ ');
})