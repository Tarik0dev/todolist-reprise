import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

    // On récupère le token
    const token = localStorage.getItem('token');

    // Si le token existe
    if (token) {
        return true;
    }

    // Si pas de token, on redirige vers la page login qui est la page d'accueil du site "/"
    router.navigate(['/']);
    return false;


};
