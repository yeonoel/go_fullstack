const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing');
var bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  mongoose.connect('mongodb+srv://ypn:<PASSWORD>@cluster0.seszc.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());
app.post('/api/products', (req, res, next) => {
    delete req.body._id
    const thing = new Thing({
        ...req.body
    });
    thing.save()
        .then((product) => res.status(201).json({product}))
        .catch((error) => res.status(400).json({error}))
});

app.put('/api/products/:id', (req, res, next) =>{
    Thing.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
        .then(() => res.status(201).json({ message: 'Modified!' }))
        .catch(error => res.status(400).json({error}))

});

app.delete('/api/products/:id', (req, res, next) =>{
    Thing.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: 'Deleted!'}))
        .catch(error => res.status(400).json({ error }));
});

app.get('/api/products/:id', (req, res, next) =>{
    Thing.findOne({_id : req.params.id})
        .then((thing) => res.status(200).json({ product: thing }))
        .catch(() => res.status(400).json({error}))

});
app.get('/api/products', (req, res, next) =>{
    Thing.find()
        .then((product) => res.status(200).json({ products: product }))
        .catch((error) => res.status(404).json({error}))
});


module.exports = app;