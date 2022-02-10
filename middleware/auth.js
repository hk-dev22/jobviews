import { UnAuthenticatedError } from "../error/index.js";
import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.log('here')
      throw new UnAuthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      // console.log(payload);
      if (!payload)
        throw new UnAuthenticatedError('Authentication invalid');
      req.user = {userId: payload.userId};
      // console.log(req.user)
      // console.log({userId: payload.userId})
      // console.log("hey");
      // console.log(req.user);
      next();
    } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid');
    }
  } catch (error) {
    next(error);
  }
}

export default auth;