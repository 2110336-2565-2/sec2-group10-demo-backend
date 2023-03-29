import { OmitType } from '@nestjs/swagger';

import { User } from '../schema/users.schema';

export class GetUsersInfoResponseDto extends OmitType(User, [
  'password',
] as const) {}
