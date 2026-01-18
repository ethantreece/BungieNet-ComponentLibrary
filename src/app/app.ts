import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HaloForumButton } from "./halo-forum-button/halo-forum-button";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HaloForumButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BungieNet-ComponentLibrary');
}
