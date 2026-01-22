import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Api } from '../services/api.service';
import { RegisterInterface } from '../models/register.interface';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterForm {

  private apiService = inject(Api)
  
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
      const colisPourApi: RegisterInterface = {
        // C'est beaucoup plus direct maintenant :
        firstName: valeurs.firstName || '', // On prend le prénom
        lastName: valeurs.lastName || '',   // On prend le nom
        email: valeurs.email || '',         // On prend l'email
        password: valeurs.password || ''    // On prend le mot de passe
      };

      // On envoie le colis
      this.apiService.postRegister(colisPourApi).subscribe({
        next: (reponse) => {
          console.log('Succès !', reponse);
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
