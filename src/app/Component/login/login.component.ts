import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { UserAuthService } from '../../Service/user-auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = "";
  password: string = "";


  loginError: any;

  constructor(private userService: UserService, private router: Router, private userAuthService: UserAuthService) { }

  login(): void {

    let authString = 'Basic ' + btoa(this.username.trim() + ':' + this.password);
    this.userAuthService.setBasicAuthString(authString);



    this.userService.login().subscribe(
      response => {
        const roles = response.roles;

        this.userAuthService.setRoles(roles);

        if (roles.includes("ADMIN")) {
          this.router.navigate(['/admin']);
        }
        else {
          this.router.navigate([''])
        }

      },
      error => {
        console.error('Login failed', error);
      }
    );
  }


  forgotPassword() {
    alert("Method not implement")
  }
}
