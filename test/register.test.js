const request = require('supertest');
const app = require('../app');
const { Customer } = require('../models');

beforeAll(async () => {
    await Customer.destroy({ where: {} });
});

afterAll(async () => {
    await Customer.destroy({ where: {} });
});

describe('Register [SUCCESS CASE]', () => {
    it('should register a new customer', async () => {
        const res = await request(app)
            .post('/customer/register')
            .send({
                name: 'Test',
                username: 'test',
                email: 'test@example.com',
                password: 'password123',
                phoneNumber: '081234567890',
                address: 'Jl. Test'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', 'test@example.com');
    });
});

describe('Register [ERROR CASE]', () => {
    it('should return error if email is empty', async () => {
        const res = await request(app)
            .post('/customer/register')
            .send({
                name: 'Test',
                username: 'test',
                password: 'password123',
                phoneNumber: '081234567890',
                address: 'Jl. Test'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Email is null');
    });

    it('should return error if password is null', async () => {
        const res = await request(app)
            .post('/customer/register')
            .send({
                name: 'Test',
                username: 'test',
                email: 'test@example.com',
                phoneNumber: '081319023264',
                address: 'Jl. Test'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Password is null');
    });

    it('should return error if email format is invalid', async () => {
        const res = await request(app)
            .post('/customer/register')
            .send({
                name: 'Test',
                username: 'test',
                email: 'invalid-email',
                password: 'password123',
                phoneNumber: '081234567890',
                address: 'Jl. Test'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Invalid email format');
    });
});