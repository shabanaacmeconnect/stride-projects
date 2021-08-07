import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../constants';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

  constructor(private http: HttpClient) {
    console.log('Hello ServiceProvider Provider');
  }
 

  login(request): Observable<any> {
   return this.http.post(`${Constants.base_url}${'login'}`, request);
  }

  addOrEditData(request): Observable<any> {
    return this.http.post(`${Constants.base_url}${'addOrEditData'}`, request);
  }

  removeData(request): Observable<any> {
    return this.http.post(`${Constants.base_url}${'removeData'}`, request);
  }

  editUser(request): Observable<any> {
    return this.http.post(`${Constants.base_url}${'editUser'}`, request);
  }
  
 
}
