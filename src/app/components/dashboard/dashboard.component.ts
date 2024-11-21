import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  providers:[DatePipe],
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  today: Date = new Date();

  constructor(private router: Router){}
  

  onLogout():void{
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

}
