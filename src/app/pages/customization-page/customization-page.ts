import { ChangeDetectionStrategy, Component, computed, effect, signal, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { SceneComponent } from "../../shared/components/scene-component/scene-component";
import { Color, Vector3 } from "three";
import { CommonModule } from "@angular/common";
import { progress } from "angular-three-soba/loaders";
import { HaloSpinner } from "../../shared/components/halo-spinner/halo-spinner";
import { h2ColorPalette } from "../../shared/models/colors";
import { H2_SPARTAN_PRIMARY_KEY, H2_SPARTAN_SECONDARY_KEY } from "../../shared/models/keys";

@Component({
  selector: 'app-customization-page',
  templateUrl: './customization-page.html',
  styleUrl: './customization-page.css',
  imports: [NgtCanvasContent, NgtCanvas, SceneComponent, CommonModule, HaloSpinner],
	host: { class: 'basic-soba' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizationPage {
  scene?: SceneComponent;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  protected readonly loader = progress();
  protected readonly displayedProgress = signal(0);


  colors = h2ColorPalette;
  primaryColor = signal(new Color('#ff0000'));
  secondaryColor = signal(new Color('#00ff00'));

  cameraPos = signal<Vector3>(new Vector3(0,0,0));

  primaryHex = computed(() => `#${this.primaryColor().getHexString()}`);
  secondaryHex = computed(() => `#${this.secondaryColor().getHexString()}`);

  primaryName = computed(() => {
    const hex = this.primaryHex().toUpperCase();
    return h2ColorPalette.find(c => c.hex.toUpperCase() === hex)?.name || 'Custom';
  });

  secondaryName = computed(() => {
    const hex = this.secondaryHex().toUpperCase();
    return h2ColorPalette.find(c => c.hex.toUpperCase() === hex)?.name || 'Custom';
  });

  constructor() {
    // Load colors from localStorage before effects run
    if (this.isBrowser) {
      const savedPrimary = localStorage.getItem(H2_SPARTAN_PRIMARY_KEY);
      const savedSecondary = localStorage.getItem(H2_SPARTAN_SECONDARY_KEY);

      if (savedPrimary) {
        this.primaryColor.set(new Color(savedPrimary));
      }

      if (savedSecondary) {
        this.secondaryColor.set(new Color(savedSecondary));
      }
    }

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H2_SPARTAN_PRIMARY_KEY, this.primaryHex());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H2_SPARTAN_SECONDARY_KEY, this.secondaryHex());
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