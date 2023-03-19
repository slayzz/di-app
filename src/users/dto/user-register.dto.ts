import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Does not have name' })
	name: string;

	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString({ message: 'Does not have password' })
	password: string;
}
