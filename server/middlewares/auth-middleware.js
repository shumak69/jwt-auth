import ApiError from "../exceptions/api-error.js";
import TokenService from "../service/token-service.js";
export default (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnathorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiError.UnathorizedError());
    }

    const userData = TokenService.valdateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnathorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnathorizedError());
  }
};
