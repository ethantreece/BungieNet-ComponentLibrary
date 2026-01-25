import { ChangeDetectionStrategy, Component, computed, effect, signal, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { SceneComponent } from "../../shared/components/scene-component/scene-component";
import { Color, Vector3 } from "three";
import { CommonModule } from "@angular/common";

const colorPalette = [
  { name: 'White',   hex: '#FDFEFF' },
  { name: 'Steel',   hex: '#535353' },
  { name: 'Red',     hex: '#BE2C2C' },
  { name: 'Orange',  hex: '#F57A1F' },
  { name: 'Gold',    hex: '#F5D22C' },
  { name: 'Olive',   hex: '#9FAC59' },
  { name: 'Green',   hex: '#21922F' },
  { name: 'Sage',    hex: '#235644' },
  { name: 'Cyan',    hex: '#16A0A0' },
  { name: 'Teal',    hex: '#36747A' },
  { name: 'Cobalt',  hex: '#416C8F' },
  { name: 'Blue',    hex: '#28459B' },
  { name: 'Violet',  hex: '#6A4EB6' },
  { name: 'Purple',  hex: '#75466D' },
  { name: 'Pink',    hex: '#FB9BC9' },
  { name: 'Crimson', hex: '#981244' },
  { name: 'Brown',   hex: '#664E3E' },
  { name: 'Tan',     hex: '#B19256' },
];

const PRIMARY_KEY = 'spartan-primary-color';
const SECONDARY_KEY = 'spartan-secondary-color';

@Component({
  selector: 'app-customization-page',
  templateUrl: './customization-page.html',
  styleUrl: './customization-page.css',
  imports: [NgtCanvasContent, NgtCanvas, SceneComponent, CommonModule],
	host: { class: 'basic-soba' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizationPage {
  scene?: SceneComponent;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  colors = colorPalette;
  primaryColor = signal(new Color('#ff0000'));
  secondaryColor = signal(new Color('#00ff00'));

  selectedPart = signal<'primary' | 'secondary' | null>(null);
  cameraPos = signal<Vector3>(new Vector3(0,0,0));

  primaryHex = computed(() => `#${this.primaryColor().getHexString()}`);
  secondaryHex = computed(() => `#${this.secondaryColor().getHexString()}`);

  primaryName = computed(() => {
    const hex = this.primaryHex().toUpperCase();
    return colorPalette.find(c => c.hex.toUpperCase() === hex)?.name || 'Custom';
  });

  secondaryName = computed(() => {
    const hex = this.secondaryHex().toUpperCase();
    return colorPalette.find(c => c.hex.toUpperCase() === hex)?.name || 'Custom';
  });

  constructor() {
    // Load colors from localStorage before effects run
    if (this.isBrowser) {
      const savedPrimary = localStorage.getItem(PRIMARY_KEY);
      const savedSecondary = localStorage.getItem(SECONDARY_KEY);

      if (savedPrimary) {
        this.primaryColor.set(new Color(savedPrimary));
      }

      if (savedSecondary) {
        this.secondaryColor.set(new Color(savedSecondary));
      }
    }

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(PRIMARY_KEY, this.primaryHex());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(SECONDARY_KEY, this.secondaryHex());
      }
    });
  }

  setPrimaryHex(hex: string) {
    this.primaryColor.set(new Color(hex));
  }

  setSecondaryHex(hex: string) {
    this.secondaryColor.set(new Color(hex));
  }

  onCameraChange(pos: Vector3) {
    this.cameraPos.set(pos.clone());
  }
};