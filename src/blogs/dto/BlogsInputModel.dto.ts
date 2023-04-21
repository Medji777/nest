import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { Trim } from '../../utils/decorators';
import { BlogsInputModel } from '../../types/blogs';

export class BlogsInputModelDTO implements BlogsInputModel {
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty({ message: 'input is required' })
  @MaxLength(13, { message: 'input is max 13 symbol' })
  readonly name: string;
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty({ message: 'input is required' })
  @MaxLength(500, { message: 'input is max 500 symbol' })
  readonly description: string;
  @IsString({ message: 'input is string' })
  @Trim()
  @IsNotEmpty({ message: 'input is required' })
  @IsUrl({ protocols: ['https'] }, { message: 'input is URL' })
  @MaxLength(100, { message: 'input is max 100 symbol' })
  readonly websiteUrl: string;
}
