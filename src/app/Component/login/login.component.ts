import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { UserAuthService } from '../../Service/user-auth.service';
import Swal from 'sweetalert2';


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

  loding: boolean = false;
  loginMsg: string = ""
  loginError: boolean = false;

  constructor(private userService: UserService, private router: Router, private userAuthService: UserAuthService) { }

  login(): void {

    let authString = 'Basic ' + btoa(this.username.trim() + ':' + this.password);
    this.userAuthService.setBasicAuthString(authString);


    this.loding = true;
    this.userService.login().subscribe(
      response => {

        this.loding = false;
        const roles = response.roles;

        this.userAuthService.setRoles(roles);
        this.userAuthService.setUserName(response.name)
        this.userAuthService.setUserEmail(response.email)

        if (roles.includes("ADMIN")) {
          this.router.navigate(['/admin']);
        }
        else {
          this.router.navigate([''])
        }

      },
      error => {
        if (error.status == 401) {
          this.loding = false
          this.loginError = true
          this.loginMsg = "Invalid email or password."
        }
        this.loding = false;
        this.userAuthService.clearLocalStorage()
        if (error.status == 0) {
          this.loginError = true
          this.loding = false
          this.loginMsg = "Login failed try again!"
        }

      }
    );
  }


  forgotPassword() {
    Swal.fire("This functionality not implemented 😔")
  }
}
