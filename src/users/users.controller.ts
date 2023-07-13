import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { CreateUsersDto } from './dto/create-user.dto';
import { errorMsgs } from '../../constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.getUserDataById(id);
  }

  @Patch('/:id')
  async updateUserData(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel | string> {
    try {
      const { name, password } = updateUserDto;
      const abc = await this.userService.updateUserData(id, name, password);
      return abc;
    } catch (e) {
      return errorMsgs.noUserFound;
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<UserModel | string> {
    try {
      const deletedUser = await this.userService.deleteUser(id);
      return deletedUser;
    } catch (e) {
      return errorMsgs.noUserFound;
    }
  }
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      return this.userService.loginUser(loginUserDto);
    } catch (e) {
      return e.message;
    }
  }
}
