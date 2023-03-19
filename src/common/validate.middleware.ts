import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { IMiddleware } from './middleware.interface';
import { UserRegisterDto } from '../users/dto/user-register.dto';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
