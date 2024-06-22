const {ObjectId} =  require('mongodb');
const {generatePin} = require('../../helpers/pin');
const { 
  HTTP_SUCCESS_2XX,
  HTTP_CLIENT_ERROR_4XX, 
  HTTP_SERVER_ERROR_5XX } = require('../../helpers/httpCodes');
const {MSG_ACCESS_DENIED} = require('../../middlewares/validateAccess');
const {MSG_WRONG_PIN} = require('../../messages/pin');
const { 
  MSG_PASSWORD_INCORRECT, 
  MSG_USER_BLOCKED, 
  MSG_USER_NOT_EXISTS, 
  MSG_NO_TOKEN, 
  MSG_INVALID_TOKEN,
  MSG_EMAIL_IS_REQUIRED,
  MSG_PASSWORD_ERROR_LENGTH,
  MSG_ROLE_ERROR_TYPE,
  MSG_INVALID_LOCK_STATE,
  MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER,
  MSG_WITHOUT_AUTH_TO_CREATE_ADMIN,
  MSG_USER_EXISTS} = require('../../messages/auth');
const { MSG_ERROR_500, MSG_DATABASE_ERROR } = require("../../messages/uncategorized");
jest.mock('../../models/Users');
jest.mock('../../helpers/user');

let mockStMlSrSet = true;
const mockStatusMailService = () => {
  if (mockStMlSrSet) {
    return Promise.resolve({online: true});
  } else {
    return Promise.resolve({online: false});
  }
};

let mockSnPnMlSet = HTTP_SUCCESS_2XX.CREATED;
const mockSendPinMail = (res) => {
  switch (mockSnPnMlSet) {
    case HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE:
      return res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({});
    case HTTP_CLIENT_ERROR_4XX.BAD_REQUEST:
      return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({});
    default:
      res.status(HTTP_SUCCESS_2XX.CREATED).json({})
      break;
  }
};

jest.mock('../../helpers/email/email', () => ({
  statusMailService: mockStatusMailService,
  sendPinMail: mockSendPinMail,  
}));

const {
  newUser,
  saveUser} = require('../../helpers/user');
const User = require('../../models/Users');
const request = require('supertest');
const express = require('express');
require('dotenv').config();

const {isRole, ROLES} = require('../../types/role');
const {
  generateJWT,
  generatePinJWT} = require('../../helpers/jwt');
const {initLog} = require('../../helpers/log/log');

process.env.LOG_FILENAME ||= "log.txt"

describe('test routes', () => {
  
  let app;

  beforeAll(async () => {
    process.env.SECRET_JWT_SEED ||= "SECRET121212121edefadfsadfds";
    process.env.PORT ||= "0.0.0.0";  
    initLog();
    app = express();
    // Lectura y parseo del body
    app.use(express.json());
    // Rutas Usuario
    app.use('/api/user', require('../../routes/user'));
    app.use('/api/users', require('../../routes/users'));
    app.use('/api/login', require('../../routes/login'));
    app.use('/api/token', require('../../routes/token'));
    app.use('/api/status', require('../../routes/status'));
    app.use('/api/restorer', require('../../routes/restorer'));
    app.use('/api/pin', require('../../routes/pin'));
    // Mockeo creación de usuario
    newUser.mockImplementation((userSchema) => {
      return {
        id: new ObjectId().toString(),
        email: userSchema.email,
        password: userSchema.password,
        role: userSchema.role,
        blocked: userSchema.blocked,    
        verified: userSchema.verified  
      };
    });
    // Mockeo guardado de usuario
    saveUser.mockImplementation((userSchema) => {
      return {
        id: new ObjectId().toString(),
        ...userSchema};
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('user', () => {
    const passUnique = "rafa123el88*";
    const passUpdated = "rafa123el88*77";
    let admin;
    let token;
    let admin2;
    let token2;
    let admin2Updated;
    let client;
    let token_client;

    beforeAll(async () => {      
      admin = {
        id: new ObjectId().toString(),
        email: "rafaelputaro@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador",
        blocked: false
      };
      admin2 = {
        id: undefined,
        email: "admin_2@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador",
        blocked: false
      };
      admin2Updated = {
        id: admin2.id,
        email: `22${admin2.email}`,
        password: "$2a$04$fIq3ZDewYkQmVdeUSWRiN.1HzZas1Hhz6cczRqLucvRnv6PwBq9um",
        role: "administrador",
        blocked: true
      };
      client = {
        id: undefined,
        email: "cliente@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "cliente",
        blocked: false
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();admin
    });

    it('should fail on log user, wrong password', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: `${passUnique}incorrecto`
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
        password: passUnique
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
        password: passUnique
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
      jest.spyOn(User, 'findOne')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: passUnique
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.ok).toBe(false);
      expect(response.body.user).toBeUndefined();
      expect(response.body.token).toBeUndefined();
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
    });    

    it('should get status module', async () => {
      jest.spyOn(User, 'find').mockReturnValueOnce([admin]);
      const response = await request(app).get('/api/status').send();
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.ok).toBe(true);
      expect(response.body.status.database.online).toBe(true);
      expect(response.body.status.service.port).toBe(process.env.PORT);
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
    }); 

    it('should fail get status module', async () => {
      jest.spyOn(User, 'find')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const response = await request(app).get('/api/status').send();
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.status.database.online).toBe(false);
      expect(response.body.status.service.port).toBe(process.env.PORT);
      expect(response.body.status.database.detail).toBe(MSG_DATABASE_ERROR);
    }); 

    it('should log user', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...admin,
        verified: true
      });
      const payload = {
        email: "rafaelputaro@gmail.com",
        password: passUnique
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.ACCEPTED);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin.role);
      expect(response.body.user.email).toBe(admin.email);
      expect(response.body.user.blocked).toBe(admin.blocked);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.id).toBe(admin.id);
      expect(response.body.user.verified).toBe(true);
      token = response.body.token;
    });

    it('should return data from token', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(
        {
          _id: admin.id,
          ...admin,
          verified: true
        });
      const response = await request(app)
        .get('/api/user/current')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin.role);
      expect(response.body.user.email).toBe(admin.email);
      expect(response.body.user.blocked).toBe(admin.blocked);
      expect(response.body.user.id).toBe(admin.id);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.verified).toBe(true);
    });

    it('should return error invalid token', async () => {
      const token_fake = token + 'f';
      const response = await request(app)
        .get('/api/user/current')
        .set('x-token', token_fake);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_INVALID_TOKEN);
    });

    it('should return error no token', async () => {
      const response = await request(app)
        .get('/api/user/current');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_NO_TOKEN);
    });

    it('should return not found', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(undefined);
      const response = await request(app)
        .get('/api/user/current')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
    });

    it('should return internal error', async () => {
      jest.spyOn(User, 'findOne')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const response = await request(app)
        .get('/api/user/current')
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
      expect(response.body.status.database.online).toBe(false);
      expect(response.body.status).toBeDefined();
    });

    it('should return database not available', async () => {
      jest.spyOn(User, 'find').mockReturnValueOnce(null);
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.status).toBeDefined();
      expect(response.body.status.database.detail).toBe(MSG_DATABASE_ERROR);
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
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token + 'F');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
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
    });

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
    
    it('should return new admin', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin);
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app)
        .post('/api/user')
        .set('x-token', token)
        .send(admin2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.body.token).toBeDefined();
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin2.role);
      expect(response.body.user.email).toBe(admin2.email);
      expect(response.body.user.blocked).toBe(admin2.blocked);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.verified).toBe(true);
      admin2.id = response.body.user.id;
      token2 = response.body.token;
    }); 

    it('should return a new token for admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin2);
      const response = await request(app)
        .post('/api/token')
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
      expect(response.body.ok).toBe(true);
      token2 = response.body.token;
    });
  
    it('should log admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...admin2,
        verified: true
      });
      const payload = {
        email: admin2.email,
        password: passUnique
      };
      const response = await request(app).post('/api/login').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.ACCEPTED);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin2.role);
      expect(response.body.user.email).toBe(admin2.email);
      expect(response.body.user.blocked).toBe(admin2.blocked);
      expect(response.body.user.id).toBe(admin2.id);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.verified).toBe(true);
    });

    it('should return admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...admin2,
        verified: true
      });
      const response = await request(app).get(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.email).toBe(admin2.email);
      expect(response.body.user.blocked).toBe(admin2.blocked);
      expect(response.body.user.id).toBe(admin2.id);
      expect(response.body.user.role).toBe(admin2.role);
      expect(response.body.user.verified).toBe(true);
    });

    it('should  admin not found', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app).get(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
    });

    it('should return internal error', async () => {
      jest.spyOn(User, 'findOne')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const response = await request(app).get(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_ERROR_500);
    });

    it('should delete admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(admin2);
      jest.spyOn(User, 'findByIdAndDelete').mockReturnValueOnce(admin2);
      const response = await request(app).delete(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
    });

    it('should fail on delete admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app).delete(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.ok).toBe(false);
    });

    it('should fail on delete admin just created. Return internal error', async () => {
      jest.spyOn(User, 'findOne')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const response = await request(app).delete(`/api/user/${admin2.id}`)
        .set('x-token', token2);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
      expect(response.body.ok).toBe(false);
    });

    it('should update admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...admin2,
        verified: true
      });
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce(
        {
          _id: admin2.id,
          ...admin2Updated,
          verified: true
        }      
      );
      const payload = {
        email: admin2Updated.email,
        password: passUpdated,
        blocked: admin2Updated.blocked
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin2Updated.role);
      expect(response.body.user.email).toBe(admin2Updated.email);
      expect(response.body.user.blocked).toBe(admin2Updated.blocked);
      expect(response.body.user.id).toBe(admin2.id);
      expect(response.body.user.verified).toBe(true);
    });

    it('should update admin just created', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...admin2,
        verified: true
      });
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce(
        {
          _id: admin2.id,
          ...admin2Updated,
          verified: true
        }      
      );
      const payload = {
        email: admin2Updated.email,
        password: passUpdated
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(admin2Updated.role);
      expect(response.body.user.email).toBe(admin2Updated.email);
      expect(response.body.user.blocked).toBe(admin2Updated.blocked);
      expect(response.body.user.id).toBe(admin2.id);
      expect(response.body.user.verified).toBe(true);
    });

    it('should fail on update admin just created because user not found', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const payload = {
        email: admin2Updated.email,
        password: passUpdated,
        blocked: admin2Updated.blocked
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
      expect(response.body.msg).toBe(MSG_USER_NOT_EXISTS);
      expect(response.body.ok).toBe(false);
    });

    it('should fail on update admin just created because bad email', async () => {
      const payload = {
        email: `${admin2Updated.email}++`,
        password: passUpdated,
        blocked: admin2Updated.blocked
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.msg.email.msg).toBe(MSG_EMAIL_IS_REQUIRED);
      expect(response.body.ok).toBe(false);
    });

    it('should fail on update admin just created because bad password', async () => {
      const payload = {
        email: admin2Updated.email,
        password: 'bad pass',
        blocked: admin2Updated.blocked
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.msg.password.msg).toBe(MSG_PASSWORD_ERROR_LENGTH);
      expect(response.body.ok).toBe(false);
    });

    it('should fail on update admin just created because bad blocked state', async () => {
      const payload = {
        email: admin2Updated.email,
        password: passUpdated,
        blocked: 'cualquier cosa'
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.msg.blocked.msg).toBe(MSG_INVALID_LOCK_STATE);
      expect(response.body.ok).toBe(false);
    });

    it('should fail on update admin just created because an internal error occurred', async () => {
      jest.spyOn(User, 'findOne')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const payload = {
        email: admin2Updated.email,
        password: passUpdated,
        blocked: admin2Updated.blocked
      };
      const response = await request(app).put(`/api/user/${admin2.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
      expect(response.body.msg).toBe(MSG_ERROR_500);
      expect(response.body.ok).toBe(false);
    });

    it('should return all the users', async () => {
      let users = [
        {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          blocked: admin.blocked,
          verified: true
        }, 
        {
          id: admin2Updated.id,
          email: admin2Updated.email,
          role: admin2Updated.role,
          blocked: admin2Updated.blocked,
          verified: true
        }];
      jest.spyOn(User, 'find').mockReturnValueOnce(users);
      const response = await request(app)
        .get('/api/users')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.users).toEqual(users);
    });

    it('should fail on get all the users', async () => {
      jest.spyOn(User, 'find')
        .mockImplementation( () => {
          throw new Error();
        }          
      );
      const response = await request(app)
        .get('/api/users')
        .set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toEqual(MSG_ERROR_500);
    });

    it('should return new client', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const payload = {
        email: client.email,
        password: passUnique,
        role: client.role,
        blocked: client.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
      expect(response.body.token).toBeDefined();
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(client.role);
      expect(response.body.user.email).toBe(client.email);
      expect(response.body.user.blocked).toBe(client.blocked);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.verified).toBe(false);
      client.id = response.body.user.id;
      token_client = response.body.token;    
    }); 

    it('should block client', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...client,
        verified: true
      });
      client.blocked = true;
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
        ...client,
        verified: true
      });
      const payload = {
        blocked: true
      };
      const response = await request(app).put(`/api/user/${client.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(client.role);
      expect(response.body.user.email).toBe(client.email);
      expect(response.body.user.blocked).toBe(true);
      expect(response.body.user.verified).toBe(true);
    });

    it('should unblock client', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...client,
        verified: true
      });
      client.blocked = false;
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
        ...client,
        verified: true
      });
      const payload = {
        blocked: true
      };
      const response = await request(app).put(`/api/user/${client.id}`)
        .set('x-token', token2)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.role).toBe(ROLES.CLIENT);
      expect(response.body.user.email).toBe(client.email);
      expect(response.body.user.blocked).toBe(false);
      expect(response.body.user.verified).toBe(true);
    });

    it('should fail o create new client', async () => {
      const payload = {
        email: "no mail",
        password: passUnique,
        role: client.role,
        blocked: client.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg.email.msg).toBe(MSG_EMAIL_IS_REQUIRED);
    });

    it('should fail o create new client', async () => {
      const payload = {
        email: client.email,
        password: 'passUnique',
        role: client.role,
        blocked: client.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg.password.msg).toBe(MSG_PASSWORD_ERROR_LENGTH);
    }); 

    it('should fail o create new client', async () => {
      const payload = {
        email: client.email,
        password: passUnique,
        role: 'jefe',
        blocked: client.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg.role.msg).toBe(MSG_ROLE_ERROR_TYPE);
    }); 

    it('should fail o create new client', async () => {
      const payload = {
        email: client.email,
        password: passUnique,
        role: client.role,
        blocked: 'sarasa'
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg.blocked.msg).toBe(MSG_INVALID_LOCK_STATE);
    }); 

    it('should fail on create admin because is client', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...client,
        verified: true
      });
      const payload = {
        email: admin.email,
        password: passUnique,
        role: admin.role,
        blocked: admin.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .set('x-token', token_client)
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER);
    });

    it('should fail on create admin because no token', async () => {
      const payload = {
        email: admin.email,
        password: passUnique,
        role: admin.role,
        blocked: admin.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_WITHOUT_AUTH_TO_CREATE_ADMIN);
    });

    it('should fail delete admin because token client', async () => {
      const response = await request(app).delete(`/api/user/${admin2.id}`)
        .set('x-token', token_client);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_ACCESS_DENIED)
    });

    it('should fail on create new client', async () => {
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        ...client,
        verified: true
      });
      const payload = {
        email: client.email,
        password: passUnique,
        role: client.role,
        blocked: client.blocked
      };
      const response = await request(app)
        .post('/api/user')
        .send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.msg).toBe(MSG_USER_EXISTS);
      expect(response.body.ok).toBe(false);
    }); 
    
  });

  describe('test role', () => {
    
    it('should return true on check "cliente"', async () => {
      expect(isRole(ROLES.CLIENT)).toBe(true);
    });

    it('should return true on check "administrador"', async () => {
      expect(isRole(ROLES.ADMINISTRATOR)).toBe(true);
    });

    it('should return false on check other string', async () => {
      expect(isRole("jefe")).toBe(false);
    });

  });

  describe('test mail service', () => {
  
    it('should return status mail service online"', async () => {
      mockSnPnMlSet = true;
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.status.mailService.online).toBe(true);
    });

    it('should return status mail service offline"', async () => {
      mockStMlSrSet = false;
      const response = await request(app).get('/api/status');
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE);
      expect(response.body.ok).toBe(false);
      expect(response.body.status.mailService.online).toBe(false);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

  });

  describe('test verified user pin', () => {
    
    beforeAll( async () => {
      client = {
        id: undefined,
        email: "cliente@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "cliente",
        blocked: false,
        verified: false
      };
    })

    it('should init verification pin', async () => {
      mockSnPnMlSet = HTTP_SUCCESS_2XX.CREATED;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/pin').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
    });

    it('should fail init verification because fail on send mail ', async () => {
      mockSnPnMlSet = HTTP_CLIENT_ERROR_4XX.BAD_REQUEST;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/pin').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
    });

    it('should fail on init verification pin because mail service not available', async () => {
      mockSnPnMlSet = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/pin').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE);
    });

    it('should fail on init verification pin because user not exists', async () => {
      mockSnPnMlSet = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app).post('/api/pin').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
    });

    it('should verify pin', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const token = await generatePinJWT(client.id, client.email, pin);
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        _id: client.id,
        ...client
      });      
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
          _id: client.id,
          id: client.id,
          email: client.email,
          role: client.role,
          blocked: client.blocked,
          verified: true
      });
      const response = await request(app).post(`/api/pin/${pin}`).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.id).toBe(client.id);
      expect(response.body.user.email).toBe(client.email);
      expect(response.body.user.role).toBe(client.role);
      expect(response.body.user.blocked).toBe(client.blocked);
      expect(response.body.user.verified).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should fail on verify pin because wrong pin', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const fakePin = 'P?00';
      const token = await generatePinJWT(client.id, client.email, pin);
      const response = await request(app).post(`/api/pin/${fakePin}`).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.msg).toBe(MSG_WRONG_PIN);
    });

    it('should fail on verify pin because bad token', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const token = await generatePinJWT(client.id, client.email, pin)+'?';
      const response = await request(app).post(`/api/pin/${pin}`).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_WRONG_PIN);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

  });

  describe('test restore pass', () => {
    
    beforeAll( async () => {
      client = {
        id: undefined,
        email: "cliente@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "cliente",
        blocked: false,
        verified: false
      };
    })

    it('should init restore pass', async () => {
      mockSnPnMlSet = HTTP_SUCCESS_2XX.CREATED;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/restorer').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
    });

    it('should fail init restore pass because fail on send mail ', async () => {
      mockSnPnMlSet = HTTP_CLIENT_ERROR_4XX.BAD_REQUEST;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/restorer').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
    });

    it('should fail on init restore pass because mail service not available', async () => {
      mockSnPnMlSet = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      const response = await request(app).post('/api/restorer').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE);
    });

    it('should fail on init restore pass pin because user not exists', async () => {
      mockSnPnMlSet = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;   
      const payload ={
        "email": client.email
      }
      jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const response = await request(app).post('/api/restorer').send(payload);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.NOT_FOUND);
    });

    it('should restore pass', async () => {
      client.id = new ObjectId().toString();
      client.password = "pasP122**A"
      const pin = generatePin();
      const token = await generatePinJWT(client.id, client.email, pin);
      jest.spyOn(User, 'findOne').mockReturnValueOnce(client);      
      jest.spyOn(User, 'findOne').mockReturnValueOnce({
        _id: client.id,
        ...client
      });      
      const clientNewPass = `${client.password}New`
      jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
          _id: client.id,
          id: client.id,
          email: client.email,
          role: client.role,
          blocked: client.blocked,
          verified: true
      });
      const payload = {
        password: `${clientNewPass}`
      };
      const response = await request(app).post(`/api/restorer/${pin}`).send(payload).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.id).toBe(client.id);
      expect(response.body.user.email).toBe(client.email);
      expect(response.body.user.role).toBe(client.role);
      expect(response.body.user.blocked).toBe(client.blocked);
      expect(response.body.user.verified).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should fail on restore pass because wrong pin', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const fakePin = 'P?00';
      const clientNewPass = `${client.pass}New`
      const payload = {
        password: `${clientNewPass}`
      };
      const token = await generatePinJWT(client.id, client.email, pin);
      const response = await request(app).post(`/api/restorer/${fakePin}`).send(payload).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.msg).toBe(MSG_WRONG_PIN);
    });

    it('should fail on restore pass because bad token', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const clientNewPass = `${client.pass}New`
      const payload = {
        password: `${clientNewPass}`
      };
      const token = await generatePinJWT(client.id, client.email, pin)+'?';
      const response = await request(app).post(`/api/restorer/${pin}`).send(payload).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe(MSG_WRONG_PIN);
    });

    it('should fail on restore pass because no password in body', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const clientNewPass = `${client.pass}New`
      const payload = {
        noPassword: `${clientNewPass}`
      };
      const token = await generatePinJWT(client.id, client.email, pin);
      const response = await request(app).post(`/api/restorer/${pin}`).send(payload).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBeDefined();
    });

    it('should fail on restore pass because bad password in body', async () => {
      client.id = new ObjectId().toString();
      const pin = generatePin();
      const clientNewPass = `New`
      const payload = {
        noPassword: `${clientNewPass}`
      };
      const token = await generatePinJWT(client.id, client.email, pin);
      const response = await request(app).post(`/api/restorer/${pin}`).send(payload).set('x-token', token);
      expect(response.headers['content-type']).toContain('json');
      expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBeDefined();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

  });

});

