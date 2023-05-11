import {Injectable} from "@nestjs/common";
import {UsersDocument} from "../../users/users.schema";
import {UserViewModelSA} from "../../types/users";

@Injectable()
export class UsersService {
    createUserMapped(model: UsersDocument): UserViewModelSA {
        return {
            id: model.id,
            login: model.login,
            email: model.email,
            createdAt: model.createdAt,
            banInfo: {
                isBanned: model.banInfo.isBanned,
                banDate: model.banInfo.banDate,
                banReason: model.banInfo.banReason
            }
        };
    }
}