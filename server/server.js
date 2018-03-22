var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/users');
var {Todo} = require('./models/todos');

var app = express();
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

app.listen(3000, ()=>{
   console.log('Starting server on 3000...');
});
