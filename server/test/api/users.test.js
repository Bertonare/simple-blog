const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { connect, closeDatabase, clearDatabase } = require('../setup');

describe('Users API', () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
        await connect();
        await clearDatabase();

        // Create Admin
        const adminRes = await request(process.env.API_URL || app)
            .post('/api/auth/register')
            .send({
                username: 'adminuser',
                email: 'admin@example.com',
                password: 'password123',
            });
        await User.findByIdAndUpdate(adminRes.body._id, { role: 'admin' });
        const adminLogin = await request(process.env.API_URL || app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'password123',
            });
        adminToken = adminLogin.body.token;

        // Create User
        const userRes = await request(process.env.API_URL || app)
            .post('/api/auth/register')
            .send({
                username: 'regular',
                email: 'regular@example.com',
                password: 'password123',
            });
        userToken = userRes.body.token;
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('GET /api/users', () => {
        it('should fetch all users (admin only)', async () => {
            const res = await request(process.env.API_URL || app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should not allow regular user to fetch users', async () => {
            const res = await request(process.env.API_URL || app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Not authorized as an admin');
        });
    });
});
