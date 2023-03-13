import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'sernhiwkhao@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty({ example: 'sernhiwkhao' })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class UpgradeToArtistDto {
  @ApiProperty({ example: 'SCB' })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({ example: '0000000000' })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;
}

export class UpgradeToPremiumDto {
  @ApiProperty({ example: 'Pol Alone' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '5555555555554444' })
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: '12/25' })
  @IsNotEmpty()
  @IsString()
  expireDate: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  @IsString()
  cvc: string;
}
