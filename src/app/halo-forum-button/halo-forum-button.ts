import { Component, input } from '@angular/core';

@Component({
  selector: 'app-halo-forum-button',
  imports: [],
  templateUrl: './halo-forum-button.html',
  styleUrl: './halo-forum-button.css',
  host: {
    '[style.--base-color]': 'baseColor()',
    '[style.--outline-color]': 'outlineColor()',
    '[style.--text-color]': 'textColor()',
    '[attr.role]': `'button'`,
    '[attr.tabindex]': `'0'`
  }
})
export class HaloForumButton {
  text = input.required<string>();
  baseColor = input<string>('#14345A');
  outlineColor = input<string>('#3FA2FC');
  textColor = input<string>('#FFFFFF');
}
