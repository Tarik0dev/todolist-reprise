import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private router = inject(Router);

  signOut(): void {
    localStorage.removeItem("token");
    this.router.navigate(['/'])
  }








  
}
