const mongosse = require('mongoose')

mongosse.connect('mongodb://localhost:27017/loja')

const conn = mongosse.connection

const produtoSchema = new mongosse.Schema({
    nome: String,
    preco: Number
},{collection: 'produto'}
)

const ObjectId = require('mongodb').ObjectId

module.exports = {Mongosse : mongosse, ProdutoSchema : produtoSchema, objectId: ObjectId}