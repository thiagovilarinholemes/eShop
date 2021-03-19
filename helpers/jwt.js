const expressJwt = require('express-jwt');

/**
 * Função que tem como objetivo verificar
 * se o token passado possui a chave secreta
 * enviada no token
 */
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked 
    })
    .unless({ // URL que não necessita de autenticação
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] }, // Liberando pelo verbo HTTP, não utiliza a API do .env
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] }, // Liberando pelo verbo HTTP, não utiliza a API do .env
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

/**
 * Método isRevoked
 * Este método para maior proteção caso
 * o usuário logado troque o token
 */
async function isRevoked(req, payload, done) {

    if(!payload.isAdmin){
        done(null, true)
    }
    done();
    
}
module.exports = authJwt;