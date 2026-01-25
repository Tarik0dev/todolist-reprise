import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token')!;
  }

  resetForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      console.log('Nouveau mot de passe :', this.resetForm.value);
      console.log('Token :', this.token);

      // Plus tard :
      // this.authService.resetPassword(this.token, this.resetForm.value)

      this.router.navigate(['/login']);
    }
  }
}
