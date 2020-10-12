interface CustomError{
    statusCode: number;
    serializeErrors(): {
        message: string;
        field?: string;
    }[]
}

export class DatabaseConnectionError extends Error implements CustomError{
    statusCode = 500;
    reason = 'Error connecting to database';

    constructor() {
       super();

       Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}