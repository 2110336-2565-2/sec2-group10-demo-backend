import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
