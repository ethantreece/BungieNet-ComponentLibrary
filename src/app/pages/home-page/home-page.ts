import { Component } from "@angular/core";
import { HaloForumButton } from "../../shared/components/halo-forum-button/halo-forum-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  imports: [HaloForumButton, RouterLink],
})
export class HomePage {
  
}
