import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { CreateUsersDto } from './dto/create-user.dto';
import { errorMsgs, statusCodes } from '../../constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/guards/authGuard';

export interface UserRequest extends Request {
  user: UserModel;
  _id: string;
}

@Controller('users')
export class UsersController {
  constructor(public userService: UsersService) {}

  @Get()
  async getUsers(@Res() res) {
    try {
      const users = await this.userService.getUsersData();

      res.send(users);
    } catch {
      res.status(statusCodes.notFound).send(errorMsgs.noUsersCreated);
    }
  }

  @Post()
  async createUsers(@Body() createUserDto: CreateUsersDto, @Res() res) {
    try {
      const createUser = await this.userService.createUser(createUserDto);
      res.status(statusCodes.created).send(createUser);
    } catch (e) {
      res.status(statusCodes.badRequest).send(errorMsgs.duplicateEmail);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserById(@Req() req: UserRequest, @Res() res) {
    try {
      const userId = req._id;
      const userDetails = await this.userService.getUserDataById(userId);
      res.status(statusCodes.success).send(userDetails);
    } catch (e) {
      res.status(statusCodes.notFound).send(errorMsgs.noUserFound);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUserData(
    @Req() req: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    try {
      const userId = req._id;
      const { name, password } = updateUserDto;
      const updatedUser = await this.userService.updateUserData(
        userId,
        name,
        password,
      );
      res.status(statusCodes.success).send(updatedUser);
    } catch (e) {
      res.status(statusCodes.notFound).send(errorMsgs.noUserFound);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: UserRequest, @Res() res) {
    try {
      const userId = req._id;

      const deletedUser = await this.userService.deleteUser(userId);
      res.status(statusCodes.success).send(deletedUser);
    } catch (e) {
      res.status(statusCodes.notFound).send(errorMsgs.noUserFound);
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
