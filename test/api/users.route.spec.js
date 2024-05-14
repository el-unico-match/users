const {MongoClient} = require('mongodb');
const request = require('supertest');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

describe('insert', () => {
  
  let connection;
  let db;
  let app;
  let server;

  beforeAll(async () => {
    process.env.PORT ||= 4000;
    process.env.HOST ||="0.0.0.0";
    app = express();
    connection = await MongoClient.connect(global.__MONGO_URI__, {
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
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
    // Escuchar peticiones
    server = app.listen(process.env.PORT, process.env.HOST, () => {});
  });

  afterAll(async () => {
    await connection.close();
    if(db.close) {
      await db.close();
    }
    expect(true).toBe(true);
    server.close();
  });

    it('should insert a doc into collection', async () => {
      
      const users = db.collection('users');

      const mockUser = {_id: 'some-user-id', name: 'John'};
      await users.insertOne(mockUser);

      const insertedUser = await users.findOne({_id: 'some-user-id'});
      expect(insertedUser).toEqual(mockUser);
    });
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