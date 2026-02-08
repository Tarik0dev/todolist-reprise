import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { CrudTaskService } from '../services/crud-task.service';
import { AddTaskResponseInterface, Task } from '../models/response/crudTaskResponse.interface';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmDialogImports],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private api = inject(CrudTaskService);
  tasks = signal<Task[]>([]);
  ngOnInit(): void {
    this.getTasks();
  }
  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  addTaskInput = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  updateTaskInput = new FormControl('', [Validators.required, Validators.maxLength(100)]);

  getTasks() {
    this.api.getTask().subscribe({
      next: (response) => {
        console.log(response.data);
        this.tasks.set(response.data);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }

  delete(taskId: number): void {
    this.api.deleteTask(taskId).subscribe({
      next: () => {
        this.getTasks();
      },
      error: () => {
        alert('Impossible de supprimer cette tâche pour le moment');
      },
    });
  }

  OnSubmitUpdatedTask(taskId: number) {
    if (this.updateTaskInput.valid) {
      const value = this.updateTaskInput.value || '';
    

      this.api.updateTask(taskId, value).subscribe({
        next: () => {
      
          this.updateTaskInput.setValue(null);
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }

  updateCheckbox(item: Task) {

   const newValue = !item.is_done;

// 2. Envoyer au serveur
this.api.completedTask(item.id, { is_done: newValue }).subscribe({
    next: () => {
        console.log('Checkbox mise à jour');
        this.getTasks();
    },
    error: (error) => {
        console.error('Erreur :', error);
    }
});
  }

  onSubmitNewTask() {
    if (this.addTaskInput.valid) {
      const value = this.addTaskInput.value;
      const taskData: AddTaskRequestInterface = {
        description: value || '',
      };

      this.api.addTask(taskData).subscribe({
        next: (response: AddTaskResponseInterface) => {
          console.log('succès :', response.message);
          this.addTaskInput.setValue(null);
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }
}
