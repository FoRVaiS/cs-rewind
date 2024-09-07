export class ApiError extends Error {
  constructor(msg: string, public readonly errorCode: number, public readonly httpStatus = 500) {
    super(msg);

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
