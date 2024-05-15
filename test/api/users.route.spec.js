const MockModel = require("jest-mongoose-mock");
const {ObjectId} =  require('mongodb');
jest.mock('../../models/Users', () => new MockModel());
const User = require('../../models/Users');
const request = require('supertest');
const express = require('express');
require('dotenv').config();
const { MSG_PASSWORD_INCORRECT, MSG_USER_BLOCKED, MSG_USER_NOT_EXISTS, MSG_NO_TOKEN } = require('../../messages/auth');
const { HTTP_SUCCESS_2XX, HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX } = require('../../helpers/httpCodes');

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
    //jest.setTimeout(70000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('admin over routes', () => {
    // https://npmtrends.com/jest-mongoose-mock
    let admin;
    let token;

    beforeAll(async () => {      
      admin = {
        id: new ObjectId().toString(),
        email: "rafaelputaro@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador",
        blocked: false
      };
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

    it('should return error no token', async () => {
      const response = await request(app)
        .get('/api/current');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_NO_TOKEN);
    });

  });

});

