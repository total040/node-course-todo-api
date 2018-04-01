var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require ('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/users');
var {Todo} = require('./models/todos');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/Todos', (req, res) => {
   var todo = new Todo({
      text: req.body.text
   });

    todo.save().then((doc) => {
        console.log('doc pushed: ', doc);
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});

app.get('/Todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });

});

app.get('/Todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }
    Todo.findById(id).then((todo) => {
        if (todo) {
            res.send({todo});
        } else {
            res.status(404).send();
        }
    }, (err) => {
        res.status(400).send();
    });

});

app.listen(port, ()=>{
   console.log(`Starting server on ${port}...`);
});

module.exports = {app};