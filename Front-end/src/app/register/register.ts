import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl(null,[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('',[Validators.required,Validators.minLength(8)]),
  });


  OnSubmit() {

    if (this.registerForm.valid) {
      console.log('Formulaire valide !', this.registerForm.value)
    } else {
      console.log('Formulaire incorrect')
    }

  }
 
}


