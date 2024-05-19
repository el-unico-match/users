//const MockModel = require("jest-mongoose-mock");
const {ObjectId} =  require('mongodb');
//jest.mock('../../models/Users', () => new MockModel());
jest.mock('../../models/Users');
const User = require('../../models/Users');
const request = require('supertest');
const express = require('express');
require('dotenv').config();
const { MSG_PASSWORD_INCORRECT, MSG_USER_BLOCKED, MSG_USER_NOT_EXISTS, MSG_NO_TOKEN, MSG_INVALID_TOKEN } = require('../../messages/auth');
const { HTTP_SUCCESS_2XX, HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX } = require('../../helpers/httpCodes');
const { MSG_ERROR_500, MSG_DATABASE_ERROR } = require("../../messages/uncategorized");
const {generateJWT} = require('../../helpers/jwt');

describe('test routes', () => {
  
  let app;

  beforeAll(async () => {
    process.env.SECRET_JWT_SEED ||= "SECRET121212121edefadfsadfds";
    app = express();
    // Lectura y parseo del body
    app.use(express.json());
    // Rutas Usuario
    app.use('/api/current', require('../../routes/current'));
    app.use('/api/user', require('../../routes/user'));
    app.use('/api/users', require('../../routes/users'));
    app.use('/api/login', require('../../routes/login'));
    app.use('/api/token', require('../../routes/token'));
    app.use('/api/status', require('../../routes/status'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('admin over routes', () => {
    // https://npmtrends.com/jest-mongoose-mock
    // https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn
    let admin;//jest.setTimeout(70000);
    let token;
    let admin2;
    let token2;
    let mockUserConstructor = jest.fn((param) => {
      return {id: new ObjectId().toString(), ...param};
    });

    beforeAll(async () => {      
      admin = {
        id: new ObjectId().toString(),
        email: "rafaelputaro@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador",
        blocked: false
      };
      admin2 = {
        id: new ObjectId().toString(),
        email: "admin_2@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador",
        blocked: false
      };
      
      User.mockImplementation(() => {
        return {
          constructor: mockUserConstructor,
        }
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should fail on log user, wrong password', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: "rafa123el88*incorrecto"
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
      expect(response.body.msg).toBe(MSG_PASSWORD_INCORRECT);
    });

    it('should fail on log user, user not exists', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(undefined);
      const payload = {
        email: "rafaelputaro22@gmail.com",
        password: "rafa123el88*"
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
    });

    it('should fail on log user, user blocked', async () => {
      let blocked = {...admin};
      blocked.blocked = true;
      jest.spyOn(User, 'findOne').mockReturnValueOnce(blocked);
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: "rafa123el88*"
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
      expect(response.body.msg).toBe(MSG_USER_BLOCKED);
    });

    it('should not log user, internal error', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(new Error());
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: "rafa123el88*"
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.ok).toBe(false);
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
    });    

    it('should log user', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: "rafa123el88*"
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.ACCEPTED);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin.role);
      expect(response.body.user.email).toBe(admin.email);
      expect(response.body.user.blocked).toBe(admin.blocked);
      expect(response.body.user.id).toBe(admin.id);
      expect(response.body.user.id).toBeDefined();
      token = response.body.token;
    });

    it('should return data from token', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(
        {
          _id: admin.id,
          ...admin
        });
      const response = await request(app)
        .get('/api/current')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin.role);
      expect(response.body.user.email).toBe(admin.email);
      expect(response.body.user.blocked).toBe(admin.blocked);
      expect(response.body.user.id).toBe(admin.id);
      expect(response.body.user.id).toBeDefined();
    });
/*
    it('should return error invalid token', async () => {
      const token_fake = token + 'f';
      const response = await request(app)
        .get('/api/current')
        .set('x-token', token_fake);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_INVALID_TOKEN);
    });
*/
    it('should return error no token', async () => {
      const response = await request(app)
        .get('/api/current');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_NO_TOKEN);
    });

    it('should return not found', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(undefined);
      const response = await request(app)
        .get('/api/current')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
    });

    it('should return internal error', async () => {
      jest.spyOn(User, 'findOne').mockImplementation(() => Promise.reject(new Error()));
      const response = await request(app)
        .get('/api/current')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_ERROR_500);
    });

    it('should return api status', async () => {
      jest.spyOn(User, 'find').mockReturnValueOnce(admin);
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.status).toBeDefined();
    });

    it('should return database not available', async () => {
      jest.spyOn(User, 'find').mockReturnValueOnce(null);
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE);
      expect(response.body.ok).toBe(false);
      expect(response.body.status).toBeDefined();
      expect(response.body.msg).toBe(MSG_DATABASE_ERROR);
    });

    it('should return a new token', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
      expect(response.body.ok).toBe(true);
      token = response.body.token;
    });

    it('should return a error no token in request', async () => {
      const response = await request(app)
        .post('/api/token');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_NO_TOKEN);
    });

    it('should return error invalid token', async () => {
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token + 'F');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_INVALID_TOKEN);
    });

    it('should return user blocked', async () => {
      const token_blocked = await generateJWT(admin.id, admin.role, true);
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token_blocked);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_BLOCKED);
    });jest.mock('../../models/Users');

    it('should return user not exists', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.token).toBeUndefined();
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
    });

    //TODO Problemas con el constructor
    /* 
    it('should return new admin', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app)
        .post('/api/user')
        .set('x-token', token)
        .send(admin2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.token).toBeUndefined();
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin2.role);
      expect(response.body.user.email).toBe(admin2.email);
      expect(response.body.user.blocked).toBe(admin2.blocked);
      expect(response.body.user.id).toBe(admin2.id);
      expect(response.body.user.id).toBeDefined();
    }); 
  */
  });

});

