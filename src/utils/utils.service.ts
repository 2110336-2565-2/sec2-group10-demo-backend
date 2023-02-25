import { isValidObjectId } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  constructor() {}

  validateMongoId(id_list: string[] | string) {
    if (typeof id_list === 'string') {
      id_list = [id_list];
    }
    id_list.forEach((id) => {
      if (!isValidObjectId(id)) {
        throw new HttpException(`Invalid id: ${id}`, 403);
      }
    });
  }
}
