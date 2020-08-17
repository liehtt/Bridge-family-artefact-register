/* Purpose: File for writing and executing test cases. */

const expect = require('chai').expect;
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

const User = require('../models/user');
const Artifact = require('../models/artifact');

// mocking a database
let mongoServer;
const opts = { useNewUrlParser: true };

var Cookies;
var userID;

before(function(done) {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then(function(mongoUri) {
      return mongoose.connect(mongoUri, opts, function(err) {
        if (err) done(err);
      });
    })
    .then(function() {done()});
});

describe('Create a user session for testing', function() {
    it("Ok, creating a new user", function(done) {
        request(app)
            .post('/signup')
            .send({firstName: "test",
                lastName: "test",
                nickName: "tester",
                birthdate: "01/01/1999",
                email: "test@gmail.com",
                password: "11111",
                confPwd: "11111"
            })
            .expect(302)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    expect(res.text).to.equal('Found. Redirecting to /');
                    // Set the cookie for user for later session
                    Cookies = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                }
            });
    });
});

describe('Sprint 1 Testing', function() {

    describe('POST /signup & login correct cases', function() {
        it('UserStory-1, OK, sign up function with correct info works', function(done) {
            request(app).post('/signup')
                .send({firstName: "alex",
                    lastName: "then",
                    nickName: "alex",
                    birthdate: "01/01/1999",
                    email: "alex@gmail.com",
                    password: "11111",
                    confPwd: "11111"
                })
                .then(function(res) {
                    expect(res.statusCode).to.equal(302);
                    expect(res.text).to.equal('Found. Redirecting to /');
                    done();
                }).catch(function(err) {done(err)})
        });

        it('UserStory-2, OK, login function works', function(done) {
            request(app).post('/login')
                .send({email: "alex@gmail.com", password: "1111"})
                .then(function(res) {
                    expect(res.statusCode).to.equal(302);
                    expect(res.text).to.equal('Found. Redirecting to /')

                    done();
                }).catch(function(err) {done(err)})
        });
    })

    describe('POST /postArtifact', function() {
        it('UserStory-4, OK, creating a new artifact works', function(done) {
            User.authenticate('alex@gmail.com', '11111', function(err, user) {
                let req = request(app).post('/postArtifact');
                req.cookies = Cookies;
                userID = user._id;
                console.log(userID);
                req.send({description: 'test description', owner: user._id})
                .then(function(res) {
                    const body = res.body;
                    expect(body).to.contain.property('image');
                    expect(body).to.contain.property('timePosted');
                    expect(body).to.contain.property('comments');
                    expect(body).to.contain.property('likes');
                    expect(body).to.contain.property('_id');
                    expect(body).to.contain.property('description');
                    expect(body).to.contain.property('__v');
                    expect(body.description).to.equal('test description');

                    done();
                }).catch(function(err) {done(err)})
            })
        });
    })

    describe('POST /signup alternate cases', function() {
        it('OK, wrong confirmation of password detection works', function(done) {
            request(app).post('/signup')
                .send({firstName: "yueru",
                    lastName: "Cheng",
                    nickName: "Chris",
                    birthdate: "10/06/1998",
                    email: "cyrhaha@gmail.com",
                    password: "12457",
                    confPwd: "123457"
                })
                .then(function(res) {
                    expect(res.text).to.equal("Passwords do not match.");
                    done();
                }).catch(function(err) {done(err)})
        });
    })
})

describe('Sprint 2 Testing', function() {

    describe('POST /createFamily', function() {
        it('UserStory-3, OK, a new family is created successfully', function(done) {
            let req = request(app).post('/createFamily');
            req.cookies = Cookies;
            req.send({
                groupName: 'Test Group Name',
                description: 'Test Description'
            })
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    const body = res.body;
                    expect(body).to.contain.property('groupName');
                    expect(body).to.contain.property('description');
                    expect(body).to.contain.property('owner');
                    expect(body).to.contain.property('members');
                    expect(body.groupName).to.equal('Test Group Name');
                    expect(body.description).to.equal('Test Description');
                    expect(body.members).to.not.be.empty;
                    expect(body.members).to.have.lengthOf(1);
                    done();
                }
            })
        });
    });

    describe('POST /editArtifact', function() {
        it('UserStory-5, OK, an artifact is successfully edited', function(done) {
            let req = request(app).post('/postArtifact');
            req.cookies = Cookies;
            req.send({ description: 'test description two'})
            .end(function (err, res) {
                const body = res.body;
                expect(body).to.contain.property('description');
                expect(res.body.description).to.equal('test description two');
                let req2 = request(app).post('/editArtifact');
                req2.cookies = Cookies;
                req2.send({text: 'changed description two', id: body._id})
                    .end(function (err, updated) {
                        expect(updated.body.description).to.equal('changed description two');
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            })
        });
    });

    describe('POST /postArtifact: Storing the time happened for artifact', function() {
        it('UserStory-7, OK, time happened during the artifact is successfully saved', function(done) {
            let req = request(app).post('/postArtifact');
            req.cookies = Cookies;
            req.send({
                description: 'test time description',
                time: '2019-01-01'
            })
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    const body = res.body;
                    expect(body).to.contain.property('description');
                    expect(body).to.contain.property('timeHappened');
                    expect(body.description).to.equal('test time description');
                    expect(body.timeHappened).to.equal('2019-01-01T00:00:00.000Z');
                    done();
                }

            });
        })
    });
})

describe('Sprint 3 Testing', () => {

    describe('POST /user/updateUserInfo: Update the personal information of a user', function() {
        it('UserStory-11, Ok, successfully upate the personal info', function(done) {
            let req = request(app).post('/user/updateUserInfo');
            req.cookies = Cookies;
            req.send({
                firstName: 'testFirst',
                lastName: 'testLast',
                nickName: 'testNick',
                gender: 'Other',
                birthdate: '02/01/1998',
                avatar: '/images/default_avatar.png'
            })
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    User.findOne({email: 'test@gmail.com'}, function(err, user) {
                        if (err) {
                            done(err);
                        } else {
                            expect(user.firstName).to.equal('testFirst');
                            expect(user.lastName).to.equal('testLast');
                            expect(user.nickName).to.equal('testNick');
                            expect(user.gender).to.equal('Other');
                            expect(user.avatar).to.equal('/images/default_avatar.png');
                            done();
                        }
                    })
                }
            })
        })
    });

    describe('POST /user/updatePassword', function () {

        it.skip('UserStory-11, Ok, successfully update the user password', function(done) {
            let req = request(app).post('/user/updatePassword');
            req.cookies = Cookies;
            req.send({
                currPwd: '11111',
                newPwd: '123456',
                confPwd: '123456'
            })
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    User.authenticate('test@gmail.com', '123456', function(err, user) {
                        if (err) {
                            done(err);
                        } else {
                            done();
                        }
                    });
                }
            });
        });
    });

    var artifactId;

    describe('POST /commentArtifact/:artifactID', () => {
        it('OK, creating new artifact to be commented', (done) => {
            request(app).post('/postArtifact')
            .send({ description: 'description test'})
            .then(function(res) {
                const body = res.body;
                expect(body).to.contain.property('description');
                expect(body.description).to.equal('description test');
                artifactId = body._id;

            })
            .then(() => done(), done);
        })
        it('UserStory-6, OK, adding comments to artifact works', (done) => {

            request(app)
            .post('/comment/commentArtifact/' + artifactId)
            .send({comment: 'test comment'})
            .then(function(res) {
                expect(res.body.comments).to.have.lengthOf(1);
            })
            .then(() => done(), done);
        })
    });

    describe('POST /postArtifact', () => {
        it('UserStory-9, OK, setting access level is successful', (done) => {
            request(app).post('/postArtifact')
            .send({description: 'description test2', viewPermission: 'selected'})
            .then(function(res) {
                const body = res.body;
                expect(body).to.contain.property('description');
                expect(body.description).to.equal('description test2');
                expect(body).to.contain.property('viewPermission');
                expect(body.viewPermission).to.equal('selected');
            })
            .then(() => done(), done);
        });
    });
});
