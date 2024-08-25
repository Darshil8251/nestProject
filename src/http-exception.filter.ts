import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();
    
    // Handling validation errors
    if (status === HttpStatus.BAD_REQUEST) {
      const message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;
      
      response
        .status(status)
        .json({
          success: false,
          message: message,
          // Include additional information if necessary
        });
    } else {
      // Handle other exceptions
      response
        .status(status)
        .json({
          success: false,
          message: exception.message,
          // Include additional information if necessary
        });
    }
  }
}
