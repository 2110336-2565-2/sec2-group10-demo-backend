import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({ example: 'sernhiwkhao' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
