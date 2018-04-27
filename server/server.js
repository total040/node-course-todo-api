require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require ('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/users');
var {Todo} = require('./models/todos');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

app.delete('/Todos/:id', (req, res) => {
   var id = req.params.id;
   if (!ObjectID.isValid(id)) {
       return res.status(404).send();
   }
   Todo.findByIdAndRemove(id).then((todo) => {
       if (!todo) {
           return res.status(404).send();
       }
       console.log('Removing todo ...');
       res.status(200).send({todo});
   }).catch((err) => {
       res.status(400).send();
   });
});

app.patch('/Todos/:id', (req, res) => {
   var id = req.params.id;
   var body = _.pick(req.body, ['text', 'completed']);
   if (!ObjectID.isValid(id)) {
     return res.status(404).send();
   }
   if (_.isBoolean(body.completed) && body.completed) {
       body.completedAt = new Date().getTime();
   } else {
       body.completedAt = null;
       body.completed = false;
   }

   Todo.findOneAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
       if (!todo) {
           return res.status(404).send();
       }
       res.send({todo});
   }).catch((err) => {
       res.status(400).send();
   });

});

app.post('/Users', (req, res) => {
   var resUser = _.pick(req.body, ['email', 'password']);
   console.log('res ', resUser);
   var user = new User(resUser);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/Users/login', (req, res) => {
    const reqUser = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(reqUser.email, reqUser.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});



app.get('/Users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/Users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
      res.status(200).send();
   }, () => {
       res.status(400).send();
   });
});

app.listen(port, ()=>{
   console.log(`Starting server on ${port}...`);
});

module.exports = {app};