import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonPage } from "./pages/button-page/button-page";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BungieNet-ComponentLibrary');
}
