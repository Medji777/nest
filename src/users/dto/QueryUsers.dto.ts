import { IsOptional} from 'class-validator';
import { Nullable, Trim, BanStatus as BanStatusSanitize } from '../../utils/decorators';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { QueryUsers } from '../../types/users';
import { BanStatus } from "../../types/types";

export class QueryUsersDto extends PaginationDto implements QueryUsers {
  @IsOptional()
  @Trim()
  @Nullable()
  searchLoginTerm: string | null = null;
  @IsOptional()
  @Trim()
  @Nullable()
  searchEmailTerm: string | null = null;
  @IsOptional()
  @BanStatusSanitize()
  @Trim()
  banStatus: BanStatus = BanStatus.all
}
