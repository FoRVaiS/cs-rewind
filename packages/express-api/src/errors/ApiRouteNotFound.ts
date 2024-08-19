import { ApiError } from './ApiError.js';

export class ApiRouteNotFound extends ApiError {
  constructor(route: string) {
    super(`Route '${route}' not found.`, 404);

    Object.setPrototypeOf(this, ApiRouteNotFound.prototype);
  }
}
