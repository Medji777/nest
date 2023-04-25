import { PassportStrategy } from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {settings} from "../../config";
import {SecurityService} from "../../security/security.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,'refreshToken') {
    constructor(private readonly securityService: SecurityService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: settings.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const data = await this.securityService.checkRefreshTokenParsed(payload);
        if(data?.userId && data?.deviceId){
            return {
                userId: data.userId,
                deviceId: data.deviceId
            }
        }
        throw new UnauthorizedException()
    }
}
