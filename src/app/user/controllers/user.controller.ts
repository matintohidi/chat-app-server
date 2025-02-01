import { UserService } from 'src/app/user/services/user.service';
import { BusinessController } from 'src/common/decorator/business-controller.decorator';

@BusinessController('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // async getUser() {
  //   return await this.userService.getUser();
  // }
}
