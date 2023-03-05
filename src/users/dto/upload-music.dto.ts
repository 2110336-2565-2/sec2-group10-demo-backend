import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UploadMusicDto {
  @ApiProperty({ example: 'Shave of Me' })
  @IsNotEmpty()
  @Matches(/^(?=.{0,50}$)[a-zA-Z0-9 ]*$/)
  name: string;

  @ApiProperty({ example: 'Just some cool music!' })
  @IsOptional()
  @Matches(/^(?=.{0,100}$)[a-zA-Z0-9 ]*$/)
  description: string;

  @ApiProperty({ example: '6401f35af8e60e217902722c' })
  @IsNotEmpty()
  @IsString()
  albumId: string;
}
