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
      this.isVisible = false; // triggers fade-out
  
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 500); // matches CSS transition time
    }, 2000); // splash display duration
  }
}
