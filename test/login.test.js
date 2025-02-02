const request = require('supertest');
const app = require('../app');
const { Customer } = require('../models');

beforeAll(async () => {
    await Customer.create({
        name: 'Test',
        username: 'test',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '081234567890',
        address: 'Jl. Test'
    });
});

afterAll(async () => {
    await Customer.destroy({ where: {} });
});

describe('Login [SUCCESS CASE]', () => {
    it('should login customer successfully', async () => {
        const res = await request(app)
            .post('/customer/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('access_token');
    });
});

describe('Login [ERROR CASE]', () => {
    it('should return error if password is wrong', async () => {
        const res = await request(app)
            .post('/customer/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toContain('invalid email / password');
    });

    it('should return error if email format is invalid', async () => {
        const res = await request(app)
            .post('/customer/login')
            .send({
                email: 'invalid-email',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toContain('invalid email / password');
    });
});