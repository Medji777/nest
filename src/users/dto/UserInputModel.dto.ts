import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../utils/decorators';
import { UserInputModel } from '../../types/users';

export class UserInputModelDto implements UserInputModel {
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  login: string;
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsEmail()
  email: string;
}
