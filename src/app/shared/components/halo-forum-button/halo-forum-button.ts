import { Component, input, output, computed } from '@angular/core';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-halo-forum-button',
  imports: [],
  templateUrl: './halo-forum-button.html',
  styleUrl: './halo-forum-button.css',
  host: {
    '[style.--base-color]': 'baseColor()',
    '[style.--outline-color]': 'outlineColor()',
    '[style.--text-color]': 'textColor()',
    '[style.--button-height]': 'buttonHeight()',
    '[style.--padding-x]': 'formattedPaddingX()',
    '[attr.role]': `'button'`,
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'disabled()',
    '[class.disabled]': 'disabled()',
    '[class.loading]': 'loading()'
  }
})
export class HaloForumButton {
  // Required inputs
  text = input.required<string>();

  // Color inputs
  baseColor = input<string>('var(--bungie-dark-blue)');
  outlineColor = input<string>('var(--bungie-light-blue)');
  textColor = input<string>('var(--white)');
  
  /**
   * Button size options:
   * - 'sm' = 48px height
   * - 'md' = 64px height
   * - 'lg' = 80px height
   * - 'xl' = 96px height
   */
  size = input<ButtonSize>('md');
  paddingX = input<number>(2.25);
  minWidth = input<number>(180);

  // State inputs
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  uppercase = input<boolean>(true);

  // Output for click events
  buttonClick = output<void>();

  // Computed properties
  buttonHeight = computed(() => {
    const sizeMap: Record<ButtonSize, string> = {
      'sm': '48px',
      'md': '64px',
      'lg': '80px',
      'xl': '96px'
    };
    return sizeMap[this.size()];
  });

  formattedPaddingX = computed(() => `${this.paddingX()}em`);

  // Handle click event
  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.buttonClick.emit();
    }
  }
}
