import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { FormGroup } from '@angular/forms';
@Injectable()
export class UtilsProvider {

  loading: any;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    console.log('Hello UtilsProvider Provider');
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }
  
  showLoading(isShow, message) {
    if (isShow) {
      this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "<div class='custom-spinner-container'>" +
          "<div class='custom-spinner-box'>" + message + "</div>" +
          "</div>"
      });
      this.loading.present();
      setTimeout(() => {
        this.loading.dismiss();
      }, 10000);
    } else {
      if (this.loading != null)
        this.loading.dismiss();
    }
  }

  showCustomAlert(isShow) {
    if (isShow) {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'alertCustom',
        content: '<img src="assets/icon/loader.svg">'
      });
      this.loading.present();
    } else {
      if (this.loading != null)
        this.loading.dismiss();
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  public alert(message, title?: any) {
    let alert = this.alertCtrl.create({
      subTitle: typeof message === 'string' ? message : "Server not responding...",
      buttons: ['OK']
    });
    if (title)
      alert.setTitle(title);
    alert.present();
  }

  showConfirmationAlert(subtitle: string) {
    return Observable.create((observer: Observer<any>) => {
      var confirmAlert = this.alertCtrl.create({
        subTitle: String(subtitle),
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              observer.next(true);
              observer.complete();
            }
          },
          {
            text: 'No',
            handler: () => {
              observer.next(false);
              observer.complete();
            }
          }
        ]
      });
      confirmAlert.present();
    })
  }
}