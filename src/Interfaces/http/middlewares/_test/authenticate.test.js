import { vi } from 'vitest';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';
import InvariantError from '../../../../Commons/exceptions/InvariantError.js';
import authenticate from '../authenticate.js';

describe('authenticate middleware', () => {
  it('should forward AuthenticationError when access token verification fails', async () => {
    // Arrange
    const mockTokenManager = new AuthenticationTokenManager();
    mockTokenManager.verifyAccessToken = vi.fn()
      .mockRejectedValue(new InvariantError('access token tidak valid'));
    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockTokenManager),
    };
    const req = { headers: { authorization: 'Bearer token-asal' } };
    const next = vi.fn();

    // Action
    await authenticate(mockContainer)(req, {}, next);

    // Assert
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('token-asal');
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
  });

  it('should attach token payload to req.auth when access token is valid', async () => {
    // Arrange
    const mockTokenManager = new AuthenticationTokenManager();
    mockTokenManager.verifyAccessToken = vi.fn()
      .mockResolvedValue({ id: 'user-123', username: 'dicoding' });
    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(mockTokenManager),
    };
    const req = { headers: { authorization: 'Bearer token-valid' } };
    const next = vi.fn();

    // Action
    await authenticate(mockContainer)(req, {}, next);

    // Assert
    expect(req.auth).toEqual({ id: 'user-123', username: 'dicoding' });
    expect(mockContainer.getInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toHaveBeenCalledWith('token-valid');
    expect(next).toHaveBeenCalledWith();
  });
});