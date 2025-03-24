import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  onToggleTheme() {
    throw new Error('Method not implemented.');
  }
  title = 'season-clock-angular';
}
