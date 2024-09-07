import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../Service/user-auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  isProfileModalOpen = false;

  constructor(private router: Router, private userAuthService: UserAuthService) { }

  toggleProfileModal() {
    this.isProfileModalOpen = !this.isProfileModalOpen;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  // logout() {
  //   if (typeof sessionStorage !== 'undefined') {
  //     sessionStorage.removeItem('username');
  //     sessionStorage.removeItem('basicauth');
  //     this.router.navigate(['/']);

  //   }

  // }

  logout() {

    this.userAuthService.clearLocalStorage()
    this.router.navigate(['/']);



  }

}
