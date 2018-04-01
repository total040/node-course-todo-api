const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

// remove all
Todo.remove({}).then((todos) => {
    console.log(todos);
});

Todo.findByIdAndRemove('').then((todo) => {
    console.log(todo);
}).catch((err) => {
    if (!ObjectID.isValid('')) {
        console.log('Sorry, object id is NOT valid');
    }
});