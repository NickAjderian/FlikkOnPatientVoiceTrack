import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {

      let w = window as any;
      if(w && w.ApiAIPlugin){
        w.ApiAIPlugin.init(
          {
              clientAccessToken: "ffa45bea858d4e758cebf00d742a0e1e", // insert your client access key here 
              lang: "en" // set lang tag from list of supported languages 
          }, 
          function(result) {  },
          function(error) { alert(error);  }
        );
        
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
