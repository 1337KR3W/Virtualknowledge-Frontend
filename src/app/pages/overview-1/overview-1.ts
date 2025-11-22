import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { Calendar1Component } from '../../components/md-components/calendar-1/calendar-1';

@Component({
  selector: 'app-overview-1',
  imports: [Calendar1Component],
  templateUrl: './overview-1.html',
  styleUrl: './overview-1.scss',
})
export class Overview1Page implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  username: string | null = null;
  userEmail: string | null = null;


  ngOnInit(): void {
    this.username = this.authService.getCurrentUsername();
    this.userEmail = localStorage.getItem('currentUserEmail');
    this.username = localStorage.getItem('currentUsername');
    this.userEmail = localStorage.getItem('currentUserEmail');
  }

  onLogout(): void {
    this.authService.logout();
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUsername');
    this.router.navigate(['/']);
  }

}
