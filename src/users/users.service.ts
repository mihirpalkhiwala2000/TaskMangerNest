import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { UserModel } from './users.model';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUsersDto } from './dto/create-user.dto';
import { errorMsgs } from '../../constants';
import { ReturnModelType } from '@typegoose/typegoose';
import { hashedPassword } from 'utils/passwordHashingUtil';
import { generateToken } from 'utils/generateTokenUtil';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private userModel: ReturnModelType<typeof UserModel>,
  ) {}

  async getUsersData(): Promise<UserModel[]> {
    const users = await this.userModel.find();
    if (!users.length) {
      throw new Error();
    }
    return users;
  }

  async createUser(createUsersDto: CreateUsersDto): Promise<UserModel> {
    const { password } = createUsersDto;
    createUsersDto.password = await hashedPassword(password);
    const newUser: UserModel = await this.userModel.create(createUsersDto);
    if (!newUser) {
      throw new Error();
    }
    return newUser;
  }

  async getUserDataById(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(errorMsgs.noTaskFound);
    }

    return user;
  }

  async updateUserData(
    id: string,
    name: string,
    password: string,
  ): Promise<UserModel> {
    const secretPassword = await hashedPassword(password);
    const updatedUserData = await this.userModel.findByIdAndUpdate(
      id,
      {
        name,
        password: secretPassword,
      },
      { new: true },
    );
    if (!updatedUserData) {
      throw new Error();
    }
    return updatedUserData;
  }

  async deleteUser(id: string): Promise<UserModel> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error();
    }
    return deletedUser;
  }
  async loginUser({ email, password }) {
    const userData = await this.userModel.findOne({ email });

    if (!userData) {
      throw new Error(errorMsgs.noUserEmailFound);
    }
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      throw new Error(errorMsgs.passwordError);
    }

    const userTokenData = await generateToken(userData);

    const userDataWithToken = await this.userModel.findOneAndUpdate(
      { email },
      { tokens: userTokenData.tokens },
    );
    const token = userTokenData.tokens[0];
    return { userData, token };
  }

  async logoutUser(id: string) {
    const logoutUser = await this.userModel.findByIdAndUpdate(id, {
      tokens: [],
    });

    return { logoutUser };
  }
}
