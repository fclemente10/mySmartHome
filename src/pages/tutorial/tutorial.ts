import {AfterViewInit, Component, OnInit} from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import {Settings} from "../../providers";

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage implements OnInit, AfterViewInit {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public translate: TranslateService,
              public platform: Platform,
              private settings: Settings,) {
    this.dir = platform.dir();
    this.settings.load().then((value)=>{
      if(value.tutorial) this.startApp();
//      this.loadLate(value.language);

    });
  }
  loadLate(language: string){
    /*     const values = this.translate.instant(["TUTORIAL_SLIDE1_TITLE",
          "TUTORIAL_SLIDE1_DESCRIPTION",
          "TUTORIAL_SLIDE2_TITLE",
          "TUTORIAL_SLIDE2_DESCRIPTION",
          "TUTORIAL_SLIDE3_TITLE",
          "TUTORIAL_SLIDE3_DESCRIPTION",
        ]);
        console.log('Loaded values', values);
          this.slides = [
             {
               title: values.TUTORIAL_SLIDE1_TITLE,
               description: values.TUTORIAL_SLIDE1_DESCRIPTION,
               image: 'assets/img/home.png',
             },
             {
               title: values.TUTORIAL_SLIDE2_TITLE,
               description: values.TUTORIAL_SLIDE2_DESCRIPTION,
               image: 'assets/img/arduino.png',
             },
             {
               title: values.TUTORIAL_SLIDE3_TITLE,
               description: values.TUTORIAL_SLIDE3_DESCRIPTION,
               image: 'assets/img/tele+telefono.png',

             }
           ];

           if (language) this.translate.setDefaultLang(language);
           else this.translate.setDefaultLang('es');
           this.translate.get(["TUTORIAL_SLIDE1_TITLE",
             "TUTORIAL_SLIDE1_DESCRIPTION",
             "TUTORIAL_SLIDE2_TITLE",
             "TUTORIAL_SLIDE2_DESCRIPTION",
             "TUTORIAL_SLIDE3_TITLE",
             "TUTORIAL_SLIDE3_DESCRIPTION",
           ]).subscribe(
             (values) => {
               console.log('Loaded values', values);
               this.slides = [
                 {
                   title: values.TUTORIAL_SLIDE1_TITLE,
                   description: values.TUTORIAL_SLIDE1_DESCRIPTION,
                   image: 'assets/img/home.png',
                 },
                 {
                   title: values.TUTORIAL_SLIDE2_TITLE,
                   description: values.TUTORIAL_SLIDE2_DESCRIPTION,
                   image: 'assets/img/arduino.png',
                 },
                 {
                   title: values.TUTORIAL_SLIDE3_TITLE,
                   description: values.TUTORIAL_SLIDE3_DESCRIPTION,
                   image: 'assets/img/tele+telefono.png',

                 }
               ];
             }); */
  }

  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }
  ngOnInit() {
  }
  ngAfterViewInit() {

  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {

    // the root left menu should be disabled on the tutorial page
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
