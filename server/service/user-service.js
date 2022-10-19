import UserModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import * as uuid from "uuid";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);
    const user = await UserModel.create({ email, password: hashPassword, activationLink });

    const userDTO = new UserDto(user); //id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Некорректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }
}

export default new UserService();
