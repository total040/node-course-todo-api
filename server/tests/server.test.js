const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

beforeEach((done) => {
   Todo.remove({}).then(() => done());
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
                   expect(docs.length).toBe(1);
                   expect(docs[0].text).toBe(text);
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
                    expect(docs.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });

});