const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text: 'todo number 1',
    _creator: user1Id
}, {
    _id: new ObjectID(),
    text: 'todo number 2',
    completed: true,
    completedAt: 4444,
    _creator: user2Id
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


const users = [{
    _id: user1Id,
    email: 'serge@example.com',
    password: 'myPass1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, 'secretkey')
    }]
}, {
    _id: user2Id,
    email: 'serge2@example.com',
    password: 'myPass2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user2Id, access: 'auth'}, 'secretkey')
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        return Promise.all([user1, user2])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};