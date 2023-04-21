import {IsOptional} from "class-validator";
import {Nullable, Trim} from "../../utils/decorators";
import {PaginationDto} from "../../utils/dto/pagination.dto";
import {QueryUsers} from "../../types/users";

export class QueryUsersDto extends PaginationDto implements QueryUsers {
    @IsOptional()
    @Trim()
    @Nullable()
    searchLoginTerm: string | null = null;
    @IsOptional()
    @Trim()
    @Nullable()
    searchEmailTerm: string | null = null;
}