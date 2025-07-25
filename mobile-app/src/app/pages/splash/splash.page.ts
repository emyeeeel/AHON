import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit {
  isVisible = true;
    constructor(private navCtrl: NavController) { }

    ngOnInit() {
      setTimeout(() => {
        this.isVisible = false;
        
        setTimeout(() => {
          this.navCtrl.navigateRoot('/tabs', {
            animated: false  
          });
        }, 500);
      }, 2500);
    }
}
