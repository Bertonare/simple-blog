const request = require('supertest');
const app = require('../../app');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const { connect, closeDatabase, clearDatabase } = require('../setup');

describe('Comments API', () => {
    let adminToken;
    let userToken;
    let userId;
    let postId;
    let commentId;

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
                username: 'commenter',
                email: 'commenter@example.com',
                password: 'password123',
            });
        userToken = userRes.body.token;
        userId = userRes.body._id;

        // Create Post to comment on
        const post = await Post.create({
            title: 'Comment Test Post',
            slug: 'comment-test-post',
            content: 'Content',
            author: adminRes.body._id,
        });
        postId = post._id.toString();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /api/comments/:postId', () => {
        it('should add a comment to a post (auth required)', async () => {
            const res = await request(process.env.API_URL || app)
                .post(`/api/comments/${postId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'Nice post!' });

            expect(res.statusCode).toBe(201);
            expect(res.body.content).toBe('Nice post!');
            commentId = res.body._id;
        });

        it('should not allow comment without auth', async () => {
            const res = await request(process.env.API_URL || app)
                .post(`/api/comments/${postId}`)
                .send({ content: 'Anonymous' });
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/comments/:postId', () => {
        it('should get comments for a post', async () => {
            const res = await request(process.env.API_URL || app).get(`/api/comments/${postId}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('DELETE /api/comments/:id', () => {
        it('should delete a comment (admin only)', async () => {
            const res = await request(process.env.API_URL || app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Comment removed');
        });
    });
});
