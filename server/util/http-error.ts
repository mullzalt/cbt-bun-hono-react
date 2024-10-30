import { HTTPException } from "hono/http-exception";

type ErrorOptions = {
  res?: Response | undefined;
  cause?: unknown;
};

export class BadRequestError extends HTTPException {
  constructor(
    message: string = "Bad request",
    { res, cause }: ErrorOptions = {},
  ) {
    super(400, { message, res, cause });
  }
}

export class UnauthorizedError extends HTTPException {
  constructor(
    message: string = "Unauthorized",
    { res, cause }: ErrorOptions = {},
  ) {
    super(401, { message, res, cause });
  }
}

export class ForbiddenError extends HTTPException {
  constructor(
    message: string = "Forbidden content",
    { res, cause }: ErrorOptions = {},
  ) {
    super(403, { message, res, cause });
  }
}

export class NotFoundError extends HTTPException {
  constructor(
    message: string = "Not found",
    { res, cause }: ErrorOptions = {},
  ) {
    super(404, { message, res, cause });
  }
}

export class ConflictError extends HTTPException {
  constructor(message: string = "Conflict", { res, cause }: ErrorOptions = {}) {
    super(409, { message, res, cause });
  }
}

export class UnprocessableEntityError extends HTTPException {
  constructor(
    message: string = "Unprocessable entity",
    { res, cause }: ErrorOptions = {},
  ) {
    super(422, { message, res, cause });
  }
}

export class UnhandledError extends HTTPException {
  constructor(
    message: string = "Internal Server Error",
    { res, cause }: ErrorOptions = {},
  ) {
    super(500, { message, res, cause });
  }
}
