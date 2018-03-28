const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');


var id = '5ab2c76ddb500c10ba89e869';

User.findOne({
    _id : id
}).then((user) => {
    console.log(user);
}).catch((err) => {
    if (!ObjectID.isValid(id)) {
       console.log('Sorry, object id is invalid');
    }
});

User.findById(id).then((user) => {
    console.log(user);
}).catch((err) => {
    if (!ObjectID.isValid(id)) {
        console.log('Sorry, object id is NOT valid');
    }
});