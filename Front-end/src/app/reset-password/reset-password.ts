import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ResetPasswordRequestInterface } from '../models/request/forgotPasswordRequest.interface';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authenticationService = inject(AuthenticationService)

  private token!: string;

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    console.log(this.token);
    if (!this.token) {
       this.router.navigate(['/']);
    }
  }

  resetForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

 isMatch() : boolean {
  if ( this.resetForm.get('password')?.value ===  this.resetForm.get('confirmPassword')?.value ){

    return true
  }
  return false
 }
  onSubmit() {
    if (this.resetForm.valid && this.isMatch()) {

      // const newPassword = {token}
      
      const data: ResetPasswordRequestInterface = {
        token: this.token,
        password: this.resetForm.get('password')?.value as string
      }

      this.authenticationService.resetPassword(data).subscribe({
        next: (response) => {
          alert(response.message);
        },
        error: (error) => {
          console.log(error);
        }
      })



      alert('Votre mot de passe à été réinitialisé avec succés !');

      this.router.navigate(['/dashboard']);
    }
  }
}
