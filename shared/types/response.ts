export type ResponseError<TCause = unknown> = {
  success: false;
  error: {
    message: string;
    stack?: string;
    cause?: TCause;
  };
};
