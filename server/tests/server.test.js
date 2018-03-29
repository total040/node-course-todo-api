const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [{
    _id: new ObjectID(),
    text: 'todo number 1'
}, {
    _id: new ObjectID(),
    text: 'todo number 2'
}];

beforeEach((done) => {
   Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
   }).then(() => done());
});

describe('POST Todos', () => {
    it('should create todo doc', (done) => {
        var text = 'test todo';

        request(app)
            .post('/Todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
               if (err) {
                   return done(err);
               }

               Todo.find().then((docs) => {
                   expect(docs.length).toBe(3);
                  // expect(docs[0].text).toBe(text);
                   done();
               }).catch((err) => done(err));
            });
    });

    it('should not create todo doc', (done) => {

        request(app)
            .post('/Todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((docs) => {
                    expect(docs.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });

});

describe('GET /Todos', () => {
    it('should return todo docs', (done) => {
        request(app)
            .get('/Todos')
            .expect(200)
            .expect((result) => {
               expect(result.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET Todos/:id', () => {
   it('should return valid todo', (done) => {;
       request(app)
           .get(`/Todos/${todos[0]._id.toHexString()}`)
           .expect(200)
           .expect((res) => {
               expect(res.body.todo.text).toBe(todos[0].text);
           })
           .end(done);

   });

    it('should return 404 for todo with bad id', (done) => {
        request(app)
            .get(`/Todos/343`)
            .expect(404)
            .end(done);

    });

    it('should return 404 for todo not found', (done) => {
        var badId = new ObjectID().toHexString();
        request(app)
            .get(`/Todos/${badId}`)
            .expect(404)
            .end(done);

    });
});