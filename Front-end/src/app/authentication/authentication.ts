import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SignInRequestInterface } from '../models/request/authenticationRequest.interface';
import { SignInResponseInterface } from '../models/response/authenticationResponse.interface';
import { ErrorMessage } from '../components/error-message/error-message';

@Component({
  selector: 'app-authentication',
  imports: [RouterLink, ReactiveFormsModule, ErrorMessage],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  public hasError = signal<boolean>(false);
  ngOnInit(): void {
    if (localStorage.getItem("token")) {
       this.router.navigate(['/dashboard']);
    }
  }

  onClosed(display: boolean) {
    this.hasError.set(display);
  }

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const authValue = this.authForm.value;
    const credentials: SignInRequestInterface = {
      email: authValue.email || '', //signifie : soit la valeur de l'input email soit rien si l'utilisateur ne le remplit pas dans ce cas il sera undifined
      password: authValue.password || '',
    };

    this.authenticationService.signIn(credentials).subscribe({
      next: (response: SignInResponseInterface) => {
        // Côté Angular (LoginComponent)
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']); // Redirection vers le dashboard
      },
      error: (erreur) => {
        this.hasError.set(true);
        console.error('Erreur :', erreur);
      },
    });
  }
}
