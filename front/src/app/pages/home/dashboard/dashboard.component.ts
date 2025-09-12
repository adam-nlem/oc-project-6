import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  isLoading: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
    }
    this.isLoading = false;
  }
}
