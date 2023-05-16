import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {DeleteUserCommand} from "../command";
import {UsersRepository} from "../../../../users/repository/users.repository";

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(private usersRepository: UsersRepository) {}
    async execute(command: DeleteUserCommand): Promise<any> {
        const isDeleted = await this.usersRepository.deleteById(command.id);
        if (!isDeleted) {
            throw new NotFoundException('user not found');
        }
    }
}