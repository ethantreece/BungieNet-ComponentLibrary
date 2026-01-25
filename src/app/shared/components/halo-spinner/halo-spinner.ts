import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

@Component({
	selector: 'app-halo-spinner',
	templateUrl: './halo-spinner.html',
	styleUrl: './halo-spinner.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--spinner-size]': 'size()',
		'[style.--spinner-color]': 'color()',
		'[style.--spinner-thickness]': 'thickness()',
	},
})
export class HaloSpinner {
	/**
	 * Size of the spinner in pixels
	 * @default '64px'
	 */
	size = input<string>('64px');

	/**
	 * Color of the spinner
	 * @default 'var(--bungie-light-blue)'
	 */
	color = input<string>('var(--bungie-light-blue)');

	/**
	 * Thickness of the spinner stroke
	 * @default '3px'
	 */
	thickness = input<string>('3px');

	/**
	 * Optional label to display below the spinner
	 * @default ''
	 */
	label = input<string>('');

	protected readonly hasLabel = computed(() => this.label().length > 0);
}
