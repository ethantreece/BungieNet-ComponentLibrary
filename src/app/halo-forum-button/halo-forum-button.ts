import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-halo-forum-button',
  imports: [],
  templateUrl: './halo-forum-button.html',
  styleUrl: './halo-forum-button.css',
  host: {
    '[style.--base-color]': 'baseColor()',
    '[style.--accent-color]': 'accentColor()',
    '[style.--outline-color]': 'outlineColor()',
    '[style.--text-color]': 'textColor()',
    '[attr.role]': `'button'`,
    '[attr.tabindex]': `'0'`
  }
})
export class HaloForumButton {
  text = input.required<string>();
  
  baseColor = input<string>('#14345A');
  accentColor = input<string>('#3B82F6');
  outlineColor = input<string>('#3FA2FC');
  textColor = input<string>('#FFFFFF');

  textShadow = computed(() => `0 0 4px ${this.accentColor()}, 0 0 8px ${this.outlineColor()}`);
}
