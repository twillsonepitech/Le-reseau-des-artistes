import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './token.interceptor';

export const InterceptorsServices =
    [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },

    ];
