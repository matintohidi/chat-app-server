import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  async getUser() {
    return `user`;
  }
}
