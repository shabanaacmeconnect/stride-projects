import { Component , OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthfakeauthenticationService } from './core/services/authfake.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  public pageLoader:boolean=true; 
  loaderSubscription: Subscription;
  constructor(private authFackservice: AuthfakeauthenticationService) {

  }
  ngOnInit() {
    this.pageLoader=false;
    this.loaderSubscription=this.authFackservice.getApiLoaderStatus().pipe(delay(0)).subscribe((response:any) => { 
      if(response.show)this.pageLoader=true;
       else this.pageLoader=false;
     });
    
    }
    ngOnDestroy(){
      this.loaderSubscription.unsubscribe();
    }
}
