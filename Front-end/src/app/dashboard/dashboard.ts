import { Component, inject, OnInit, signal  } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTaskRequestInterface } from '../models/request/crudTaskRequest.interface';
import { CrudTaskService } from '../services/crud-task.service';
import { AddTaskResponseInterface, Task } from '../models/response/crudTaskResponse.interface';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
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
        next: ()=> {
          this.getTasks()
        },
        error: ()=>{
          alert("Impossible de supprimer cette tâche pour le moment")
        }
      })
    }


  updateCheckbox(item: Task) {
    console.log(item );
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
          this.addTaskInput.setValue(null)
          this.getTasks();
        },
        error: (error) => {
          console.error('Erreur :', error);
        },
      });
    }
  }
}
