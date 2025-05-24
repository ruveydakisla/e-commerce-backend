export class CustomException extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "CustomException";
  }
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
      time: new Date().toISOString(),
    };
  }
}
