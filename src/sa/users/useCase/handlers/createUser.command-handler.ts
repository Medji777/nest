import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateUserCommand} from "../command";
import {PassHashService} from "../../../../applications/passHash.service";
import {UsersRepository} from "../../../../users/users.repository";
import {UsersDocument} from "../../../../users/users.schema";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly passHashService: PassHashService,
        private readonly usersRepository: UsersRepository,
    ) {}
    async execute(command: CreateUserCommand): Promise<UsersDocument> {
        const { bodyDTO } = command;
        const passwordHash = await this.passHashService.create(bodyDTO.password);
        const doc = this.usersRepository.create(
            bodyDTO.login,
            bodyDTO.email,
            passwordHash,
            command.dto,
        );
        await this.usersRepository.save(doc);
        return doc;
    }
}