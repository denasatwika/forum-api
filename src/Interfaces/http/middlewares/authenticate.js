import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const authenticate = (container) => async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const [scheme, accessToken] = authorization.trim().split(/\s+/);

    if (scheme.toLowerCase() !== 'bearer' || !accessToken) {
      throw new AuthenticationError('Invalid authentication scheme');
    }

    const tokenManager = container.getInstance(
      AuthenticationTokenManager.name
    );

    try {
      req.auth = await tokenManager.verifyAccessToken(accessToken);
    } catch {
      throw new AuthenticationError('access token tidak valid');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticate;