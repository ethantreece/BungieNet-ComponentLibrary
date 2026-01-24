import { Component, computed, signal } from "@angular/core";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { SceneComponent } from "../../shared/components/scene-component/scene-component";
import { Color } from "three";

@Component({
  selector: 'app-customization-page',
  templateUrl: './customization-page.html',
  styleUrl: './customization-page.css',
  imports: [NgtCanvasContent, NgtCanvas, SceneComponent],
	host: { class: 'basic-soba' },
})
export class CustomizationPage {
  scene?: SceneComponent;  

  primaryColor = signal(new Color('#ff0000'));
  secondaryColor = signal(new Color('#00ff00'));

  primaryHex = computed(() => `#${this.primaryColor().getHexString()}`);
  secondaryHex = computed(() => `#${this.secondaryColor().getHexString()}`);
  
  setPrimary(event: Event) {
    const hex = (event.target as HTMLInputElement).value;
    const color = new Color(hex);
    this.primaryColor.set(color);
  }

  setSecondary(event: Event) {
    const hex = (event.target as HTMLInputElement).value;
    const color = new Color(hex);
    this.secondaryColor.set(color);
  }
};