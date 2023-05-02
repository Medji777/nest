import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateAuthCommand} from "../commads";
import {SecurityService} from "../../../security/security.service";
import {ActiveCodeAdapter} from "../../../adapters/activeCode.adapter";
import {JwtService} from "@nestjs/jwt";
import {settings} from "../../../config";
import {TokenPayload} from "../../../types/auth";

@CommandHandler(CreateAuthCommand)
export class CreateAuthCommandHandler implements ICommandHandler<CreateAuthCommand> {
    constructor(
        private readonly securityService: SecurityService,
        private readonly activeCodeAdapter: ActiveCodeAdapter,
        protected jwtService: JwtService,
    ) {}
    async execute(command: CreateAuthCommand): Promise<TokenPayload> {
        const {userId,deviceName,ip} = command;

        const deviceId = this.activeCodeAdapter.generateId();

        const accessToken = await this.jwtService.signAsync(
            { userId },
            { expiresIn: '10h', secret: settings.JWT_SECRET },
        );
        const refreshToken = await this.jwtService.signAsync(
            { userId, deviceId },
            { expiresIn: '20h', secret: settings.JWT_SECRET },
        );

        await this.securityService.createSession(
            refreshToken,
            deviceName,
            ip,
        );

        return {
            token: {
                accessToken,
            },
            refreshToken,
            options: {
                httpOnly: true,
                secure: true,
            },
        };
    }
}