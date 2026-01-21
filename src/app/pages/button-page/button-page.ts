import { Component, signal } from "@angular/core";
import { HaloForumButton } from "../../shared/components/halo-forum-button/halo-forum-button";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.html',
  styleUrl: './button-page.css',
  imports: [HaloForumButton, MatSlideToggle, MatTooltipModule],
})
export class ButtonPage {

  defaultVisible = signal(true);

  toggleDefaultVisible(): void {
    this.defaultVisible.set(!this.defaultVisible());
  }
};
