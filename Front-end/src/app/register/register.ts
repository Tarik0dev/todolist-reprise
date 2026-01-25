import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthenticationService } from '../services/authentication.service';
import { RegisterRequestInterface } from '../models/request/authenticationRequest.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterForm {

  private authenticationService = inject(AuthenticationService)
  private router = inject(Router)

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  passwordsMatch(): boolean {
    return (
      this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value
    );
  }

    onSubmit() {
    const passwordsOk = this.passwordsMatch();

    if (this.registerForm.valid && passwordsOk) {

      const valeurs = this.registerForm.value;

      // Décortiquons le NOUVEAU colis
      const colisPourApi: RegisterRequestInterface = {
        // C'est beaucoup plus direct maintenant :
        firstName: valeurs.firstName || '', // On prend le prénom
        lastName: valeurs.lastName || '',   // On prend le nom
        email: valeurs.email || '',         // On prend l'email
        password: valeurs.password || ''    // On prend le mot de passe
      };

      // On envoie le colis
      this.authenticationService.register(colisPourApi).subscribe({
        next: (reponse) => {
          alert(reponse.message);
          this.router.navigate(['/'])
        },
        error: (erreur) => {
          console.error('Erreur :', erreur);
        }
      });

    } else {
      console.log('Erreur formulaire');
      this.registerForm.markAllAsTouched();
    }
  }
}
