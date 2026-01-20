const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { connect, closeDatabase, clearDatabase } = require('../setup');

describe('Auth API', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.username).toBe('testuser');
        });

        it('should not register a user with an existing email', async () => {
            await User.create({
                username: 'existing',
                email: 'test@example.com',
                password: 'password123',
            });

            const res = await request(process.env.API_URL || app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // we manually hash password or use the route to register? 
            // Using the route is safer if there are hooks, but here no hooks yet.
            // But let's use the route to be sure it works correctly.
            await request(process.env.API_URL || app)
                .post('/api/auth/register')
                .send({
                    username: 'loginuser',
                    email: 'login@example.com',
                    password: 'password123',
                });
        });

        it('should login with correct credentials', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword',
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });
});
