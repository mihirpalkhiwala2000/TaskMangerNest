import { index, modelOptions, prop } from '@typegoose/typegoose';
import { TokenDto } from './dto/token.dto';

@modelOptions({ schemaOptions: { timestamps: true, collection: 'User' } })
@index({ email: 1 }, { unique: true })
export class UserModel {
  @prop()
  name: string;

  @prop({ required: true })
  password: string;

  @prop({ trim: true })
  email: string;

  @prop()
  tokens: TokenDto[];
}
