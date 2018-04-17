const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /Todos/:id', () => {
    it ('should delete todo document', (done) => {
       var hexId = todos[1]._id.toHexString();
       request(app)
           .delete(`/Todos/${hexId}`)
           .expect(200)
           .expect((res) => {
              expect(res.body.todo._id).toBe(hexId);
           })
           .end((err, res) => {
               if (err) {
                   return done(err);
               }

               Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
               }).catch((e) => done());
           });
    });

    it ('should not find todo document to delete', (done) => {
        var badId = new ObjectID().toHexString();
        request(app)
            .delete(`/Todos/${badId}`)
            .expect(404)
            .end(done);
    });

    it ('should return 404 due to id is invalid', (done) => {
        request(app)
            .delete(`/Todos/343`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /Todos/:id', () => {
   it ('should update todo body', (done) => {
       var hexId = todos[0]._id.toHexString();
       request(app)
           .patch(`/Todos/${hexId}`)
           .send({text: 'updated', completed: true})
           .expect(200)
           .expect((res) => {
               expect(res.body.todo.text).toBe('updated');
               expect(res.body.todo.completed).toBe(true);
               //expect(res.body.todo.completedAt).toBeA('number');
           })
           .end(done);
   });

    it ('should nullify todos completedAt prop' , (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/Todos/${hexId}`)
            .send({text: 'updated', completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('updated');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /Users/me', () => {
   it ('should return user info when authenticated', (done) => {
      request(app)
          .get('/Users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body._id).toBe(users[0]._id.toHexString())
              expect(res.body.email).toBe(users[0].email)
          })
          .end(done)
   });

    it ('should return user info when authenticated', (done) => {
        request(app)
            .get('/Users/me')
            .set('x-auth', 'no')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});


describe('POST /Users', () => {
    it ('should create a user when valid data', (done) => {
        var email = 'serge0@example.com';
        var password = 'serpass!';
        request(app)
            .post('/Users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBeTruthy();
                expect(res.body._id).toBeTruthy();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                } else {
                    User.findOne({email}).then((user) => {
                       expect(user).toBeTruthy();
                       done();
                    });
                }
            });
    });

    it ('should return a validation error when invalid data', (done) => {
        var email = 'serge@example.com';
        var password = 'ser';
        request(app)
            .post('/Users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body._message).toBe('User validation failed');
            })
            .end(done)
    });

    it ('should not create a user when duplicate email', (done) => {
        var password = 'serpass!';
        request(app)
            .post('/Users')
            .send({users[0].email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toEqual(11000);
            })
            .end(done);
    });
});