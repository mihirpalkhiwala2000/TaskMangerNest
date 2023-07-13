import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { errorMsgs } from '../../constants';
import { UsersService } from 'src/users/users.service';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException();
    }
    try {
      if (!authorization.includes('Bearer')) {
        throw new Error(errorMsgs.unauthorized);
      }
      const authToken = authorization.replace('Bearer ', '') as string;

      const decoded = verify(
        authToken,
        process.env.JWT_CODE as string,
      ) as JwtPayload;

      const userDetails = await this.userService.getUserDataById(
        decoded._id as string,
      );

      if (!userDetails) {
        throw new UnauthorizedException();
      }
      userDetails;
      const { _id }: any = userDetails;
      req.user = userDetails;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
