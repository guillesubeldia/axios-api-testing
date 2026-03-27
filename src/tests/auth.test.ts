import { expect } from 'chai';
import { AuthService } from '../services/auth.service';
import { config } from '../utils/config';

describe('AuthService', () => {
  let authService: AuthService;

  before(() => {
    authService = new AuthService();
  });

  describe('POST /auth - createToken', () => {
    it('should return a token with valid credentials', async () => {
      const response = await authService.createToken();

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('token');
      expect(response.data.token).to.be.a('string').and.not.empty;
    });

    it('should return bad credentials message with invalid credentials', async () => {
      const response = await authService.createToken('wronguser', 'wrongpass');

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('reason');
    });

    it('should use the configured admin credentials by default', async () => {
      const response = await authService.createToken(
        config.adminUsername,
        config.adminPassword
      );

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('token');
    });
  });
});
