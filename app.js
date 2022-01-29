const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
}))

const porta = 3000
const rota = express.Router()

app.use('/', rota)
app.use(express.json()) 

const db = require('./db')
const ObjectId = db.objectId

const Produto = db.Mongosse.model('esquemaProduto',db.ProdutoSchema,'produto')

rota.get('/', async(requisicao, resposta) =>{
    resposta.send('<h1>Servidor Node Funcionando</h1>')
})

rota.get('/produtos', async(requisicao, resposta) =>{
    await Produto.find({}).lean().exec(function(e,listaRegistros){
        resposta.json(listaRegistros)
        resposta.end()
    })
})

app.set('view engine', 'ejs')

//carregar o css
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))


rota.get('/produtosCliente', async(requisicao, resposta) =>{
    const ListaProdutos = await Produto.find({}).lean().exec()
    resposta.render('Produtos',{ListaProdutos})
})

rota.get('/novoProduto', async(requisicao, resposta) =>{
    resposta.render('insereProduto', {title: 'Inserir Novo Produto'})
})

rota.post('/novoProduto', async(requisicao, resposta) =>{
    let nome = requisicao.body.nome
    let preco = requisicao.body.preco

    let novoProduto = new Produto({nome, preco})
    try{
        await novoProduto.save()
        resposta.redirect('/produtosCliente')
    }
    catch(err){
        next(err)
    }
})

rota.get('/deletarProduto/:id', async(requisicao, respsota) =>{
    let id = requisicao.params.id
    Produto.findByIdAndRemove(id,() =>[
        respsota.redirect('/produtosCliente')
    ])
})

rota.get('/editar/:id', async(requisicao, resposta) =>{
    const id = requisicao.params.id
    const produto = await Produto.findById({"_id":id})
    resposta.render('editarproduto', {title: 'Alterar Produto', produto, action:'/editar/' + produto.id})
})

rota.post('/editar/:id', async(requisicao, resposta) =>{
    const id = requisicao.params.id
    const produto = requisicao.body.nome
    const preco = requisicao.body.preco
    await Produto.updateOne({_id:id},{$set: {nome : produto, preco: preco}})
    resposta.redirect('/produtosCliente')
})

app.listen(porta)
console.log('Servidor Node rodando na porta 3000!')