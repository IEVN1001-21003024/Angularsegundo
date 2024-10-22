import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemahComponent } from './tem/temah/temah.component';
import { TemapComponent } from './tem/temap/temap.component';
//import { Ejemplo1Component } from './formulario/ejemplo1/ejemplo1.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TemapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // also, it's styleUrls, not styleUrl
})
export class AppComponent {
  title = 'angularsegundo';
}