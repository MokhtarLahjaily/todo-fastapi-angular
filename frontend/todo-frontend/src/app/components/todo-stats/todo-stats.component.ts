import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../../services/todo.service';
import { TodoStats } from '../../models/todo.model';

@Component({
  selector: 'app-todo-stats',
  templateUrl: './todo-stats.component.html',
  styleUrls: ['./todo-stats.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ]
})
export class TodoStatsComponent {
  @Input() stats: TodoStats = {
    total: 0,
    pending: 0,
    completed: 0,
    completion_rate: 0
  };
  loading = false;
  error: string | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadStats();
    
    // Recharger les stats quand les todos changent
    this.todoService.todos$.subscribe(() => {
      this.loadStats();
    });
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    this.todoService.getStats().subscribe({
      next: (stats: TodoStats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur chargement stats:', error);
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
      }
    });
  }
}
