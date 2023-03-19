import 'reflect-metadata';
import { Container } from 'inversify';
import { UserModel } from '@prisma/client';

import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './user.service.interface';
import { UserService } from './user.service';
import { TYPES } from '../types';
import { User } from './user.entity';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();

let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;
beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;
describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				name: user.name,
				email: user.email,
				password: user.password,
			}),
		);
		createdUser = await userService.createUser({
			email: 'a@a.com',
			name: 'Lol',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'a@a.com',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'a@a.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({
			email: 'a@a.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
