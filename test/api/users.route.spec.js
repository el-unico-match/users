const {MongoClient} = require('mongodb');
const request = require('supertest');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
//const User = require('../../models/Users');

describe('insert', () => {
  
  let connection;
  let db;
  let app;

  beforeAll(async () => {
    process.env.PORT ||= 4000;
    //process.env.HOST ||= "0.0.0.0";
    process.env.SECRET_JWT_SEED ||= "SECRET";
    app = express();
    connection = await MongoClient.connect(global.__MONGO_URI__, {
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    const User = db;
    // CORS
    app.use(cors());
    // Directorio público
    app.use(express.static('public'));
    // Lectura y parseo del body
    app.use(express.json());
    // Rutas Usuario
    app.use('/api/current', require('../../routes/current'));
    app.use('/api/user', require('../../routes/user'));
    app.use('/api/users', require('../../routes/users'));
    app.use('/api/login', require('../../routes/login'));
    app.use('/api/token', require('../../routes/token'));
    app.use('/api/status', require('../../routes/status'));
    jest.setTimeout(70000);
  });

  afterAll(async () => {
    await connection.close();
    if(db.close) {
      await db.close();
    }
    expect(true).toBe(true);
    //server.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    const mockUser = {
      _id: "0dafdafdfdfsf",
      email: "rafaelputaro@gmail.com",
      password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
      role: "administrador",
      blocked: "false"
    };
    await users.insertOne(mockUser);
    const insertedUser = await users.findOne({_id: mockUser._id});
    expect(insertedUser).toEqual(mockUser);
  });

  it('should log user', async () => {
    const payload = {
      email: "rafaelputaro@gmail.com",
      password: "rafa123el88*"
    };
    const response = await request(app).post('/api/login').send(payload);
    expect(response.headers['content-type']).toContain('json');
    expect(response.body.ok).toBe(false);
    expect(response.body.msg).toBe("Please talk to the administrator");
    expect(response.status).toBe(500);
    //let cantUsers = await User.find().length;    
    //expect(cantUsers).toBe(1);
  });
// https://npmtrends.com/jest-mongoose-mock
  /*
  it('should insert a doc into collection', async () => {
    
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });*/
});


/*

const request = require('supertest');
const {MongoClient} = require('mongodb');

process.env.PORT = 4000;
process.env.HOST="0.0.0.0";

describe('Tests over API users', () => {
    let connection;
    let db;
    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {});
          db = await connection.db(global.__MONGO_DB_NAME__);
        expect("1").toBe("1");
    });

    describe('GET /api/users', () => {
        
        beforeEach(() => {
            
        })
        
        it('La ruta funciona', async () => {
            const users = db.collection('users');
            const mockUser = {_id: 'some-user-id', name: 'John'};
            await users.insertOne(mockUser);
   //         const response = await request(app).get('/api/users').send();
   //         expect(response.status).toBe(200);
            expect("1").toBe("1");
   //         console.log(response);
            const insertedUser = await users.findOne({_id: 'some-user-id'});
            expect(insertedUser).toEqual(mockUser);
        });
    });
});

*/