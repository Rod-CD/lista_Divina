import { Component, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';

import { Lista } from './lista/lista';

@Component({
  selector: 'app-root',
  imports: [Lista],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Front');
}
