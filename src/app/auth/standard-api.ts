import { UserModel } from 'src/app/user/DTOs/user.dto';
import { StandardApiInterface } from '../../common/decorator/standard-api.decorator';
import { LoginUserModel, RegisterUserModel } from 'src/app/auth/DTOs/auth.dto';

export const Me: StandardApiInterface = {
  type: UserModel,
  description:
    'Get user profile information including personal details, preferences, and settings',
  summary: 'Retrieve detailed user profile information',
  version: 1,
};

export const Register: StandardApiInterface = {
  type: RegisterUserModel,
  description: 'Register a new user with personal details and preferences',
  summary: 'Create a new user account',
  version: 1,
};

export const Login: StandardApiInterface = {
  type: LoginUserModel,
  description: 'Authenticate a user with their credentials',
  summary: 'User login to access their account',
  version: 1,
};
