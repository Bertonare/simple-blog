const request = require('supertest');
const app = require('../../app');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { connect, closeDatabase, clearDatabase } = require('../setup');

describe('Posts API', () => {
    let adminToken;
    let userToken;
    let postSlug;

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

        // Manually update role to admin as register defaults to user
        await User.findByIdAndUpdate(adminRes.body._id, { role: 'admin' });

        // Login to get fresh token with admin role (though token doesn't store role, it store id)
        const loginRes = await request(process.env.API_URL || app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'password123',
            });
        adminToken = loginRes.body.token;

        // Create Regular User
        const userRes = await request(process.env.API_URL || app)
            .post('/api/auth/register')
            .send({
                username: 'regularuser',
                email: 'user@example.com',
                password: 'password123',
            });
        userToken = userRes.body.token;
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /api/posts', () => {
        it('should create a new post (admin only)', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Test Post',
                    slug: 'test-post',
                    content: 'This is a test post content.',
                    categories: ['Test'],
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe('Test Post');
            postSlug = res.body.slug;
        });

        it('should not allow regular user to create a post', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'User Post',
                    slug: 'user-post',
                    content: 'Should fail',
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Not authorized as an admin');
        });
    });

    describe('GET /api/posts', () => {
        it('should fetch all posts', async () => {
            const res = await request(process.env.API_URL || app).get('/api/posts');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.posts)).toBe(true);
            expect(res.body.posts.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/posts/:slug', () => {
        it('should fetch a single post by slug', async () => {
            const res = await request(process.env.API_URL || app).get(`/api/posts/${postSlug}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.slug).toBe(postSlug);
        });

        it('should return 404 for non-existent post', async () => {
            const res = await request(process.env.API_URL || app).get('/api/posts/non-existent');
            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/posts/:slug', () => {
        it('should update a post (admin only)', async () => {
            const res = await request(process.env.API_URL || app)
                .put(`/api/posts/${postSlug}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Updated Title',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Updated Title');
        });
    });

    describe('DELETE /api/posts/:slug', () => {
        it('should delete a post (admin only)', async () => {
            const res = await request(process.env.API_URL || app)
                .delete(`/api/posts/${postSlug}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Post removed');
        });
    });
});
