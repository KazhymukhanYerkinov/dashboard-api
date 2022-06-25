import { LoggerService } from "../logger/logger.service";
import { Router, Response } from 'express';
import { IControllerRoute } from "./route.interface";

export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: LoggerService) {
		this._router = Router();
	}

	get router() {
		return this._router;
	}

	public send<T>(response: Response,code: number, message: T) {
		response.type('application/json');
		return response.status(code).json(message);
	}

	public ok<T>(response: Response, message: T) {
		this.send<T>(response, 200, message);
	}

	public created(response: Response) {
		response.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]) {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const handler = route.func.bind(this);
			this.router[route.method](route.path, handler);
		}
	}
}