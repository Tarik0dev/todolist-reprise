import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage {
  message = input<string>();
  display = input<boolean>(false);
  errorDisplayed = output<boolean>();

  close() {
    this.errorDisplayed.emit(false);
  }
}
