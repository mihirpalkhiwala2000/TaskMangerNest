import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
