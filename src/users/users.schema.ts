import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PasswordHash } from '../types/users';

type PayloadType = EmailConfirmation | PasswordConfirmation;

export type UsersDocument = HydratedDocument<Users>;
export type UsersModelType = Model<UsersDocument> & UsersModelStatic;

@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ default: null })
  confirmationCode?: string | null;

  @Prop()
  expirationDate?: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema({ _id: false })
class PasswordConfirmation extends EmailConfirmation {}

const PasswordConfirmationSchema =
  SchemaFactory.createForClass(PasswordConfirmation);

@Schema()
export class Users {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  createdAt?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordConfirmationSchema })
  passwordConfirmation: PasswordConfirmation;

  updatePassword(payload: PasswordHash) {
    this.passwordHash = payload.passwordHash;
  }
  updatePasswordConfirmationData(payload: PasswordConfirmation) {
    this.passwordConfirmation = payload;
  }
  updateConfirmation() {
    this.emailConfirmation.isConfirmed = true;
  }
  updateConfirmationData(payload: EmailConfirmation) {
    this.emailConfirmation = payload;
  }

  static make(
    login: string,
    email: string,
    passwordHash: string,
    UserModel: UsersModelType,
    payload,
  ): UsersDocument {
    const date = new Date();
    const newUser = {
      id: `${+date}`,
      login: login,
      email: email,
      createdAt: date.toISOString(),
      passwordHash,
      emailConfirmation: payload?.emailConfirmation || {
        confirmationCode: null,
        isConfirmed: true,
      },
      passwordConfirmation: payload?.passwordConfirmation || {
        confirmationCode: null,
        isConfirmed: true,
      },
    };
    return new UserModel(newUser);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.methods = {
  updatePassword: Users.prototype.updatePassword,
  updatePasswordConfirmationData:
    Users.prototype.updatePasswordConfirmationData,
  updateConfirmation: Users.prototype.updateConfirmation,
  updateConfirmationData: Users.prototype.updateConfirmationData,
};

const userStaticMethods: UsersModelStatic = {
  make: Users.make,
};

UsersSchema.statics = userStaticMethods;

export type UsersModelStatic = {
  make: (
    login: string,
    email: string,
    passwordHash: string,
    UserModel: UsersModelType,
    payload?: PayloadType,
  ) => UsersDocument;
};
