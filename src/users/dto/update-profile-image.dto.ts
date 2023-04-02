import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'please upload image file in this field',
  })
  profileImage: any;
}
