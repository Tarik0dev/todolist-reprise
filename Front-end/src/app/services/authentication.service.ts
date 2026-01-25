import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequestInterface, SignInRequestInterface } from '../models/request/authenticationRequest.interface';
import { SignInResponseInterface, RegisterResponseInterface } from '../models/response/authenticationResponse.interface';
import { ForgotPasswordRequest } from '../models/request/forgotPasswordRequest.interface';
import { ForgotPasswordResponse } from '../models/response/forgotPasswordResponse.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

private http = inject(HttpClient);
  
  // L'URL de ton API Express (vérifie ton port, souvent 3000 ou 8080)
  private apiUrl = 'http://localhost:3000';


 register(user: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    return this.http.post<RegisterResponseInterface>( // 2. Enlève les [] (on inscrit 1 personne, pas une liste)
      this.apiUrl + '/register',      // Argument 1 : L'URL
      user                    // Argument 2 : LE BODY (les données)
    );
  }

  signIn(user:SignInRequestInterface): Observable<SignInResponseInterface> {
    return this.http.post<SignInResponseInterface>(this.apiUrl + '/auth', user)
  }

  forgotPassword(email:ForgotPasswordRequest): Observable<ForgotPasswordResponse> {

    return this.http.post<ForgotPasswordResponse>(this.apiUrl + '/forgot-password',email)
  }
}
