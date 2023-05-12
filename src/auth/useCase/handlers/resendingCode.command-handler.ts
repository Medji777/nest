import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException} from "@nestjs/common";
import {ResendingCodeCommand} from "../commands";
import {ActiveCodeAdapter} from "../../../adapters/activeCode.adapter";
import {UsersService} from "../../../users/users.service";
import {EmailAdapter} from "../../../adapters/email.adapter";

@CommandHandler(ResendingCodeCommand)
export class ResendingCodeCommandHandler implements ICommandHandler<ResendingCodeCommand> {
    constructor(
        private activeCodeAdapter: ActiveCodeAdapter,
        private usersService: UsersService,
        private emailAdapter: EmailAdapter,
    ) {}
    async execute(command: ResendingCodeCommand): Promise<void> {
        const {bodyDTO} = command;
        const emailConfirmation = this.activeCodeAdapter.createCode();
        await this.usersService.updateConfirmationData(
            bodyDTO.email,
            emailConfirmation,
        );
        try {
            await this.emailAdapter.sendCodeConfirmationMessage(
                bodyDTO.email,
                emailConfirmation.confirmationCode,
                'confirm-registration',
            );
        } catch (err) {
            console.log(err);
            throw new BadRequestException()
        }
    }
}