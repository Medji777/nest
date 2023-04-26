import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'codeConfirm', async: true })
@Injectable()
export class CodeConfirmValidate implements ValidatorConstraintInterface {
  private error: string;
  constructor(private usersService: UsersService) {}
  async validate(code: string): Promise<boolean> {
    const resp = await this.usersService.checkConfirmCode(code);
    if (resp.message) this.error = resp.message;
    return resp.check;
  }
  defaultMessage() {
    return this.error;
  }
}
