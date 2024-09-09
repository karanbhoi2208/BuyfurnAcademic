import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../../Service/user-auth.service';
import { UserProfileComponent } from '../../Component/user-profile/user-profile.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [NgIf, NgClass, RouterLink, UserProfileComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  isProfileModalOpen = false;

  constructor(private router: Router, private userAuthService: UserAuthService) { }
  name = this.userAuthService.getUserName();
  email = this.userAuthService.getUserEmail();
  toggleProfileModal() {
    this.isProfileModalOpen = !this.isProfileModalOpen;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }
  logout() {
    this.userAuthService.clearLocalStorage()
    this.router.navigate(['/']);
  }

}
