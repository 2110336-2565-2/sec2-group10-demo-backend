import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../users/schema/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel
      .findOne(
        { email: email.toLowerCase() },
        { password: 1, username: 1, email: 1 },
      )
      .lean();
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, roles: user.roles };
    console.log(payload);
    return {
      name: user.username,
      email: user.email,
      accessToken: this.jwtService.sign(payload),
      image: '',
    };
  }

  async logout(req: any) {
    req.logout();
    return 'logout success';
  }
}
