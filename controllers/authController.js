import User from "../models/User.js";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";

const register = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
      next(new Error('please provide all values'));
    }
    const userAlreadyExists = await User.findOne({email});
    if (userAlreadyExists)
      throw new BadRequestError('Email already in use');
    const user = await User.create({name, email, password});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName
    }, token });
  } catch (error) {
    next(error);
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestError('Please provide all values');
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user)
      throw new UnAuthenticatedError('Invalid credentials');
    console.log(user);
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      throw new UnAuthenticatedError('Wrong Password');
    user.password = undefined;
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user, token, location: user.location
    });
  } catch (error) {
    next(error);
  }

}

const updateUser = async (req, res, next) => {
  try {
    const { email, name, lastName, location } = req.body;
    // if (!email || !name || !lastName || !location)
      // throw new BadRequestError('Please provide all values');
    // console.log('here')
    // console.log(email, name, lastName, location);
    // console.log(req.user);
    const user = await User.findOneAndUpdate({ _id: req.user.userId }, {
      email: email, name: name, lastName: lastName, location: location
    }, { new: true });
    // console.log(user);
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user, token, location: user.location
    });

    // console.log(user);
    // user.id = req.user;
    // user.email = email;
    // user.name = name;
    // user.lastName = lastName;
    // user.location = location;
    // await user.update();
  }
  catch(error) {
    next(error);
  }
}

export { register, login, updateUser };