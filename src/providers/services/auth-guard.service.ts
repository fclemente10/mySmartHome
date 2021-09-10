import {Injectable, OnInit} from '@angular/core';
import {NavController} from "ionic-angular";
import { User } from '../../providers';


@Injectable()
export class AuthGuardService implements OnInit {
  constructor(  public navCtrl: NavController,
                public user: User) {}

  ngOnInit() {
    if (!this.user.isLoggedIn()) {
      this.navCtrl.push('/');
      return false;
    }
    return true;
  }
}
