// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { plainToClass } from 'class-transformer';

// @Injectable()
// export class ResponseValidationInterceptor implements NestInterceptor {
  

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       map(data => {
//         if (Array.isArray(data)) {
//           return data.map(item => plainToClass(this.dtoClass, item));
//         } else {
//           return plainToClass(this.dtoClass, data);
//         }
//       }),
//     );
//   }
// }
