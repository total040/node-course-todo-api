const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TestApp', (err, client) =>{
    if (err) {
       return console.log('Unable to connect to Mongo DB');
    }
    console.log('Connected to Mongo DB TodoApp');
    const db = client.db('TodoApp');

    //deleteMany
    /*db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res) => {
       console.log(res);
    });*/
    //deleteOne
    /*db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res) => {
        console.log(res);
    });*/
    //findOneAndDelete
    /*db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((res) => {
        console.log(res);
    }); */

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5aad5f943f0103e456985b7b')}).then((res) => {
        console.log(res);
    });


    client.close();
});