import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterInterface } from '../models/register.interface';

@Injectable({
  providedIn: 'root',
})
export class Api {

private http = inject(HttpClient);
  
  // L'URL de ton API Express (vérifie ton port, souvent 3000 ou 8080)
  private apiUrl = 'http://localhost:3000';

 
 postRegister(utilisateur: RegisterInterface): Observable<RegisterInterface> {
    return this.http.post<RegisterInterface>( // 2. Enlève les [] (on inscrit 1 personne, pas une liste)
      this.apiUrl + '/register',      // Argument 1 : L'URL
      utilisateur                    // Argument 2 : LE BODY (les données)
    );
  }
}
