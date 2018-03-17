const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TestApp', (err, client) =>{
    if (err) {
       return console.log('Unable to connect to Mongo DB');
    }
    console.log('Connected to Mongo DB TodoApp');
    const db = client.db('TodoApp');
   /* db.collection('Todos').insertOne({
       text: 'A lot to do!',
       completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to inset!');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    */
    db.collection('Users').insertOne({
        name: 'Sergi',
        age: 27,
        location: 'Rotterdam'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to inset user', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    client.close();
});