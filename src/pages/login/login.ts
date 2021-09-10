import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, NavController, Platform, ToastController} from 'ionic-angular';
import { User } from '../../providers';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private ngUnsubscribe = new Subject();
  account: { email: string, contrasena: string } = {
    email: '1',
    contrasena: '1'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              private platform: Platform,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public localNotifications: LocalNotifications) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
    })
  }
  /*
  btnMsn() {
    let toast = this.toastCtrl.create({
      message: 'Usted tiene una nueva notificacion',
      duration: 4000,
      position: 'top'
    });
    toast.present();
    this.scheduleNotification();
  }
  scheduleNotification() {
    this.platform.ready().then(()=>{
      this.localNotifications.schedule({
        id: Math.round(Math.random() * 1000000), // this'll generate an id of 7 random digits
        title:'Attention',
        text:'Rk notification',
    });
  });
}*/
  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).pipe(takeUntil(this.ngUnsubscribe)).subscribe((resp) => {
      this.navCtrl.push('ContentPage');
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
  }


}
