import { Routes } from '@angular/router';
import { RegisterForm } from './register/register';
import { Authentication } from './authentication/authentication';
import { Dashboard } from './dashboard/dashboard';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterForm,
    title: ' inscrivez-vous !',
  },
  {
    path: '',
    component: Authentication,
    title: ' Connectez-vous !',
  },
   {
    path: 'dashboard',
    component: Dashboard,
    title: 'Task Flow',
  },
   {
    path: 'forgot-password',
    component: ForgotPassword ,
    title: 'TaskFlow',
  },
   {
    path: 'reset-password',
    component: ResetPassword ,
    title: 'TaskFlow',
  },
];
