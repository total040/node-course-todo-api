const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TestApp', (err, client) =>{
    if (err) {
       return console.log('Unable to connect to Mongo DB');
    }
    console.log('Connected to Mongo DB TodoApp');
    const db = client.db('TodoApp');

   /* db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5aad506ff357ad1ab4f55b2d'),
    },
    {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });*/

    db.collection('Users').findOneAndUpdate({
            _id: new ObjectID('5aad568f3f0103e456985ac9'),
        },
        {
            $set: {
                text: 'More beer!'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((res) => {
        console.log(res);
    });


    client.close();
});