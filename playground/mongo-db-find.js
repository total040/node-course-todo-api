const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TestApp', (err, client) =>{
    if (err) {
       return console.log('Unable to connect to Mongo DB');
    }
    console.log('Connected to Mongo DB TodoApp');
    const db = client.db('TodoApp');
    db.collection('Users').find({name : 'Sergi'}).count().then((count) => {
       console.log(`Fetched ${count} Sergis`);
    }, (err) => {
       console.log('Failed to fetch Sergis');
    });
    client.close();
});