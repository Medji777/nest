import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SaveUserCommand} from "../commands";
import {ActiveCodeAdapter} from "../../../adapters/activeCode.adapter";
import {EmailAdapter} from "../../../adapters/email.adapter";
import {UsersService} from "../../../users/users.service";

@CommandHandler(SaveUserCommand)
export class SaveUserCommandHandler implements ICommandHandler<SaveUserCommand> {
    constructor(
        private readonly activeCodeAdapter: ActiveCodeAdapter,
        private readonly emailAdapter: EmailAdapter,
        private readonly usersService: UsersService,
    ) {}
    async execute(command: SaveUserCommand): Promise<void> {
        const emailConfirmation = this.activeCodeAdapter.createCode();
        const newUser = await this.usersService.create(command.bodyDTO, {
            emailConfirmation,
        });
        try {
            await this.emailAdapter.sendCodeConfirmationMessage(
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
                'confirm-email',
            );
        } catch (err) {
            console.log(err);
            await this.usersService.deleteUser(newUser.id);
        }
    }
}