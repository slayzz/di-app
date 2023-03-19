import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString({ message: 'Does not have password' })
	password: string;
}
