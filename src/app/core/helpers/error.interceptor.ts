import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthfakeauthenticationService,) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            this.authenticationService.setApiLoaderStatus()

            if (err.status === 401 ||err.status==403) {
                // auto logout if 401 response returned from api
                 this.authenticationService.logout();
                // location.reload();
            }
            if (err.status === 400 || err.status === 422) {
                if( err.error.data)
                Swal.fire('Error',  err.error.data, 'warning');
                else{
                    Swal.fire('Error', 'Invalid Input', 'warning');
                }

            }else
            Swal.fire('Error',  'Oops... Some error occured. Please try again later.', 'warning');
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
