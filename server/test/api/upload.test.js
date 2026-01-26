const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../../app');

describe('Upload API', () => {
    const testImagePath = path.join(__dirname, 'test-image.png');

    beforeAll(() => {
        // Create a dummy image for testing
        fs.writeFileSync(testImagePath, 'dummy content');
    });

    afterAll(() => {
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        // Cleanup uploads folder if needed, but let's leave it for now or use a temp one
    });

    describe('POST /api/upload', () => {
        it('should upload an image', async () => {
            const res = await request(process.env.API_URL || app)
                .post('/api/upload')
                .attach('image', testImagePath);

            expect(res.statusCode).toBe(200);
            expect(res.text).toMatch(/\/uploads[\\\/]image-/);
        });

        it('should fail if no file is attached', async () => {
            // Depending on multer config, this might behavior differently. 
            // In upload.js it uses upload.single('image')
            const res = await request(app).post('/api/upload');
            // Multer usually throws an error if required file is missing or just continues with empty req.file
            // The route handler: res.send(`/${req.file.path}`); will throw if req.file is undefined
            expect(res.statusCode).toBe(500);
        });
    });
});
