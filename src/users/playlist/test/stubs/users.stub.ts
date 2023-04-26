import { Types } from 'mongoose';

import { Role } from '../../../../common/enums/role';
import { User } from '../../../schema/users.schema';

export const createUser = (body = {}): User => {
  const defaultBody: User = {
    _id: new Types.ObjectId(),
    username: 'user@gmail.com',
    password: '$2b$10$XyTuaAPqNePCQKGi/yGLie3zmQ6GwOT7D8kvZUSznrRqPNdGkJyHW',
    email: 'user@gmail.com',
    accountNumber: 1,
    bankName: 'SCB',
    roles: [Role.User, Role.Artist, Role.Premium],
    following: [],
    registrationDate: new Date(),
    profileImage:
      'https://storage.googleapis.com/demo-tuder-music/profileImage/1680570779149.png',
  };
  return { ...defaultBody, ...body };
};
