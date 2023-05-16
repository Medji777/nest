import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'checkUniqueEmail', async: true })
@Injectable()
export class CheckUniqueEmailValidate implements ValidatorConstraintInterface {
    constructor(private usersQueryRepository: UsersQueryRepository) {}
    async validate(email: string): Promise<boolean> {
        return this.usersQueryRepository.getIsUniqueUserByEmail(
            email,
        );
    }
    defaultMessage(): string {
        return 'User already registration';
    }
}