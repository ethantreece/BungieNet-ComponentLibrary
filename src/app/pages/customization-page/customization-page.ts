import { Component, computed, effect, signal } from "@angular/core";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { SceneComponent } from "../../shared/components/scene-component/scene-component";
import { Color } from "three";

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
  imports: [NgtCanvasContent, NgtCanvas, SceneComponent],
	host: { class: 'basic-soba' },
})
export class CustomizationPage {
  scene?: SceneComponent;  

  colors = colorPalette;
  primaryColor = signal(new Color('#ff0000'));
  secondaryColor = signal(new Color('#00ff00'));

  primaryHex = computed(() => `#${this.primaryColor().getHexString()}`);
  secondaryHex = computed(() => `#${this.secondaryColor().getHexString()}`);

  ngOnInit() {
    const savedPrimary = localStorage.getItem(PRIMARY_KEY);
    const savedSecondary = localStorage.getItem(SECONDARY_KEY);

    if (savedPrimary) {
      this.primaryColor.set(new Color(savedPrimary));
    }

    if (savedSecondary) {
      this.secondaryColor.set(new Color(savedSecondary));
    }
  }

  constructor() {
    effect(() => {
      localStorage.setItem(PRIMARY_KEY, this.primaryHex());
    });

    effect(() => {
      localStorage.setItem(SECONDARY_KEY, this.secondaryHex());
    });
  }

  setPrimaryHex(hex: string) {
    this.primaryColor.set(new Color(hex));
  }

  setSecondaryHex(hex: string) {
    this.secondaryColor.set(new Color(hex));
  }
};