import { Component, output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { AddTaskResponseInterface } from '../models/response/crudTaskResponse.interface';
import { CrudTaskService } from '../services/crud-task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  private api = inject(CrudTaskService);

  close = output<void>();
  taskAdded = output<void>();

  priorities = [
    { label: 'Faible', value: 'low' },
    { label: 'Normale', value: 'medium' },
    { label: 'Haute', value: 'high' },
  ];

  createTaskForm = new FormGroup({
    titleTask: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(100)]),
    priority: new FormControl('medium', [Validators.required]),
    dueDate: new FormControl(''),
  });

  onSubmitNewTask() {
    if (this.createTaskForm.valid) {
      const form = this.createTaskForm.value;

      const taskData: AddTaskRequestInterface = {
        titleTask: form.titleTask || '',
        description: form.description || null,
        priority: form.priority || 'medium',
        dueDate: form.dueDate || null,
      };

      this.api.addTask(taskData).subscribe({
        next: (response: AddTaskResponseInterface) => {
          this.createTaskForm.reset();
          this.taskAdded.emit();
          this.close.emit();
        },
        error: (error) => {
          console.error('Erreur API :', error);
        },
      });
    }
  }
}
