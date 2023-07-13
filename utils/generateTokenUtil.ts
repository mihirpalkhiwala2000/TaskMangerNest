import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

export const generateToken = async (userData: any): Promise<any> => {
  const token = jwt.sign(
    { _id: userData._id.toString() },
    process.env.JWT_CODE as string,
  );

  userData.tokens = token;

  return userData;
};
