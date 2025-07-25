import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  imports: [],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss'
})
export class SplashComponent implements OnInit {
  isVisible = true;
  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = false;
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
    }, 2500);
  }
}
