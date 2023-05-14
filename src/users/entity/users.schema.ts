import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import {BanInputModel, PasswordHash} from '../../types/users';
import { ErrorResponse } from '../../types/types';

type PayloadType = {
  emailConfirmation?: EmailConfirmation,
  passwordConfirmation?: PasswordConfirmation
};

export type UsersDocument = HydratedDocument<Users>;
export type UsersModelType = Model<UsersDocument> & UsersModelStatic;

@Schema()
class EmailConfirmation {
  @Prop({ default: null })
  confirmationCode?: string | null;

  @Prop()
  expirationDate?: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

@Schema()
class PasswordConfirmation extends EmailConfirmation {}

@Schema({ _id: false })
class BanInfo {
  @Prop({ default: false })
  isBanned: boolean

  @Prop({ default: null })
  banDate: string | null

  @Prop({ default: null })
  banReason: string | null
}

const BanInfoSchema = SchemaFactory.createForClass(BanInfo)

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

  @Prop({ type: Types.ObjectId, ref: EmailConfirmation.name })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: Types.ObjectId, ref: PasswordConfirmation.name })
  passwordConfirmation: PasswordConfirmation;

  @Prop({ type: BanInfoSchema, default: () => ({}) })
  banInfo: BanInfo

  updatePassword(payload: PasswordHash) {
    this.passwordHash = payload.passwordHash;
  }
  updatePasswordConfirmationData(payload: PasswordConfirmation) {
    this.passwordConfirmation = payload;
  }
  updateConfirmation(model?: UsersDocument) {
    let path = 'emailConfirmation.isConfirmed';
    this.emailConfirmation.isConfirmed = true;
    model.markModified(path)
  }
  updateConfirmationData(payload: EmailConfirmation) {
    this.emailConfirmation = payload;
  }
  updateBan(payload: BanInputModel) {
    this.banInfo.isBanned = payload.isBanned;
    this.banInfo.banReason = payload.banReason;
    this.banInfo.banDate = new Date().toISOString();
  }

  async checkValidCode(isEmail: boolean = false): Promise<ErrorResponse> {
    if (this.emailConfirmation.isConfirmed) {
      return {
        check: false,
        code: 'confirm',
      };
    }
    const expirationDate = this.emailConfirmation.expirationDate;
    if (!isEmail && expirationDate && expirationDate < new Date()) {
      return {
        check: false,
        code: 'expired',
      };
    }
    return {
      check: true,
    };
  }

  async checkValidRecoveryCode(): Promise<ErrorResponse> {
    const expirationDate = this.passwordConfirmation.expirationDate;
    if (expirationDate && expirationDate < new Date()) {
      return {
        check: false,
        code: 'expired',
      };
    }
    return {
      check: true,
    };
  }

  static make(
    login: string,
    email: string,
    passwordHash: string,
    UserModel: UsersModelType,
    payload?: PayloadType,
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
  checkValidCode: Users.prototype.checkValidCode,
  checkValidRecoveryCode: Users.prototype.checkValidRecoveryCode,
  updatePassword: Users.prototype.updatePassword,
  updatePasswordConfirmationData: Users.prototype.updatePasswordConfirmationData,
  updateConfirmation: Users.prototype.updateConfirmation,
  updateConfirmationData: Users.prototype.updateConfirmationData,
  updateBan: Users.prototype.updateBan
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