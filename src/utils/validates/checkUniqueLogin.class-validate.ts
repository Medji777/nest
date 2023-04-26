import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/users.query-repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'checkUniqueLogin', async: true })
@Injectable()
export class CheckUniqueLoginValidate implements ValidatorConstraintInterface {
    constructor(private usersQueryRepository: UsersQueryRepository) {}
    async validate(login: string): Promise<boolean> {
        return this.usersQueryRepository.getIsUniqueUserByLogin(
            login,
        );
    }
    defaultMessage(): string {
        return 'User already registration';
    }
}