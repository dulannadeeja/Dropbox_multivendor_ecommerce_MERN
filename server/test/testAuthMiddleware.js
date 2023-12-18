const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { app } = require('../app'); // Replace with the actual path to your Express app
const authMiddleware = require('../middlewares/isAuth'); // Replace with the actual path to your middleware

const { expect } = chai;

chai.use(chaiHttp);

describe('Auth Middleware', () => {
    it('should return 401 if no Authorization header is present', (done) => {
        chai.request(app)
            .get('/feed/posts')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 401 if an invalid token is provided', (done) => {
        chai.request(app)
            .get('/feed/posts')
            .set('Authorization', 'Bearer invalidtoken')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should set userId in request if a valid token is provided', (done) => {
        const userId = 'someUserId';
        const token = jwt.sign({ userId }, 'XUIGBISBBVUVBBIGVFYTYSFTFCBSBSCUIOHNIOSHCNGSB');

        chai.request(app)
            .get('/feed/posts')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200); // Assuming a successful response
                expect(res.req.userId).to.equal(userId);
                done();
            });
    });
});