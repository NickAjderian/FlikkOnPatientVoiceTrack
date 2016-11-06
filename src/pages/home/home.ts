import { Component, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef
  //,NgZone 
} from '@angular/core';

import { NavController } from 'ionic-angular';

class LogItem{
  time: Date;
  activity:string;
  name:string;
  location:string;
}

@Component({
  selector: 'page-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private changeDetectorRef: ChangeDetectorRef
    //,private zone: NgZone
    ) {
  //this.startTicks();
  }

  logs:LogItem[] = []; 
  nameText:string;
  locationText:string;
  activityText:string;
  tickCount:number = 0;

  speakText(msg:string){
    let w = window as any;
    try{
      if(w && w.TTS){
        w.TTS.speak(
          {
            text:msg,
            locale:'en-GB',
            rate:1.0
          },
          ()=>{},
          (e)=>{}
        );
      }
    }catch(e){

    }
  }

/*
  startTicks(){
    //doesn't help
    //this.zone.run(()=>{
    //  this.tickCount++;
    //});
    this.tickCount++;
    //means the whole UI does not update
    try{
      this.changeDetectorRef.markForCheck();
    }catch(e){
      console.log(e);
    }
    setTimeout(
      ()=>{
        this.startTicks();
      },10000
    );

  }
*/
  logActivity(){
    //this.zone.run(()=>
    //  {
        let l:LogItem = new LogItem();
        l.time = new Date();
        l.activity = this.activityText;
        l.name = this.nameText;
        l.location = this.locationText;
        this.logs.splice(0,0,l);
    //  }
    //);


  }

  sendVoice(){
    try{
        let w = window as any;
        if(w && w.ApiAIPlugin){
          let me = this;
          w.ApiAIPlugin.requestVoice(
          {}, // empty for simple requests, some optional parameters can be here 
          function (response) {
              // place your result processing here 
              //alert(JSON.stringify(response));
              if(response.result && response.result.parameters){
                let r = response.result;
                if(r){
                  me.activityText = null;
                  me.nameText = null;
                  me.locationText = null; 
                                    
                  let p = r.parameters;
                  if(p){
                    let l:LogItem = new LogItem();
                    if(p.Activity){
                      l.activity=p.Activity.join(',');
                    }
                    if(p["given-name"]){
                      l.name = p["given-name"].join(',');
                    }
                    if(p.Location){
                      l.location = p.Location.join(',');

                    }
                    me.activityText = l.activity;
                    me.nameText = l.name;
                    me.locationText = l.location;  
                    if(me.nameText){
                      me.logActivity();  
                
                    }              
                    try{
                      me.changeDetectorRef.markForCheck();
                    }catch(e){
                      console.log(e);
                    }                     
                  }
                  let msg = 'ok lee dokeley';
                  if(!me.nameText){
                    msg = 'Sorry, I did not hear the patient name';
                  }else if(r.fulfillment && r.fulfillment.speech){
                    msg = r.fulfillment.speech;
                  }
                  me.speakText(msg);

                }
              }
          },
          function (error) {
              // place your error processing here 
              //alert(error);
              me.speakText('say again?');
          });
        } else{
          alert('sorry no voice stuff on this platform');
        } 
    }catch(e){
      alert(e);
    }
  }


}
