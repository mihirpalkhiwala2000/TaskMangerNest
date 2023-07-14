import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { CreateUsersDto } from './dto/create-user.dto';
import { errorMsgs } from '../../constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/guards/authGuard';
import { ObjectId } from 'mongodb';

export interface UserRequest extends Request {
  user: UserModel;
  _id: string;
}

@Controller('users')
export class UsersController {
  constructor(public userService: UsersService) {}

  @Get()
  getUsers(): Promise<UserModel[]> {
    return this.userService.getUsersData();
  }

  @Post()
  async createUsers(
    @Body() createUserDto: CreateUsersDto,
  ): Promise<UserModel | string> {
    try {
      const createUser = await this.userService.createUser(createUserDto);
      return createUser;
    } catch (e) {
      return errorMsgs.duplicateEmail;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getUserById(@Req() req: UserRequest): Promise<UserModel> {
    const userId = req._id;
    return this.userService.getUserDataById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUserData(
    @Req() req: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel | string> {
    try {
      const userId = req._id;
      const { name, password } = updateUserDto;
      const abc = await this.userService.updateUserData(userId, name, password);
      return abc;
    } catch (e) {
      return errorMsgs.noUserFound;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: UserRequest): Promise<UserModel | string> {
    try {
      const userId = req._id;

      const deletedUser = await this.userService.deleteUser(userId);
      return deletedUser;
    } catch (e) {
      return errorMsgs.noUserFound;
    }
  }
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: any) {
    try {
      const { userData, token } = await this.userService.loginUser(
        loginUserDto,
      );

      res.send({ userData, token });
    } catch (e) {
      res.status(404).send(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logoutUser(@Req() req: UserRequest, @Res() res) {
    const userId = req._id;
    const { logoutUser } = await this.userService.logoutUser(userId);

    res.send({ logoutUser });
  }
}
