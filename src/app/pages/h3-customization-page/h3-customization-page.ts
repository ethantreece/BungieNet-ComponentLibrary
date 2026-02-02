import { ChangeDetectionStrategy, Component, computed, effect, signal, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { Color, Vector3 } from "three";
import { CommonModule } from "@angular/common";
import { progress } from "angular-three-soba/loaders";
import { HaloSpinner } from "../../shared/components/halo-spinner/halo-spinner";
import { h3ColorPalette } from "../../shared/models/colors";
import { H3_SPARTAN_PRIMARY_KEY, H3_SPARTAN_SECONDARY_KEY, H3_SPARTAN_TERTIARY_KEY, H3_SPARTAN_HEAD_KEY, H3_SPARTAN_LEFT_SHOULDER_KEY, H3_SPARTAN_RIGHT_SHOULDER_KEY, H3_SPARTAN_BODY_KEY } from "../../shared/models/keys";
import { H3SceneComponent } from "../../shared/components/h3-scene-component/scene-component";
import { H3Armors, H3ArmorDisplayNames, SpartanArmorOptions } from "../../shared/models/h3_armor";
import { CustomizationMenuComponent } from "../../shared/components/customization-menu/customization-menu.component";

@Component({
  selector: 'app-h3-customization-page',
  templateUrl: './h3-customization-page.html',
  styleUrl: './h3-customization-page.css',
  imports: [NgtCanvasContent, NgtCanvas, H3SceneComponent, CommonModule, HaloSpinner, CustomizationMenuComponent],
	host: { class: 'basic-soba' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H3CustomizationPage {
  scene?: H3SceneComponent;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  protected readonly loader = progress();
  protected readonly displayedProgress = signal(0);
  
  // Expose colors to template for other uses if any
  colors = h3ColorPalette;

  // Signal State for Scene & Menu
  primaryColor = signal(new Color('#ff0000'));
  secondaryColor = signal(new Color('#00ff00'));
  tertiaryColor = signal(new Color('#0000ff'));

  helmet = signal(H3Armors.MARK6);
  leftShoulder = signal(H3Armors.MARK6);
  rightShoulder = signal(H3Armors.MARK6);
  body = signal(H3Armors.MARK6);

  weaponRotX = signal(0);
  weaponRotY = signal(0);
  weaponRotZ = signal(0);
  
  updateWeaponRotX(amount: number) { this.weaponRotX.update(v => v + amount); }
  updateWeaponRotY(amount: number) { this.weaponRotY.update(v => v + amount); }
  updateWeaponRotZ(amount: number) { this.weaponRotZ.update(v => v + amount); }

  cameraPos = signal<Vector3>(new Vector3(0,0,0));

  // Computed Hex Strings for Menu Binding
  primaryHex = computed(() => `#${this.primaryColor().getHexString()}`);
  secondaryHex = computed(() => `#${this.secondaryColor().getHexString()}`);
  tertiaryHex = computed(() => `#${this.tertiaryColor().getHexString()}`);

  constructor() {
    // Load colors from localStorage before effects run
    if (this.isBrowser) {
      const savedPrimary = localStorage.getItem(H3_SPARTAN_PRIMARY_KEY);
      const savedSecondary = localStorage.getItem(H3_SPARTAN_SECONDARY_KEY);
      const savedTertiary = localStorage.getItem(H3_SPARTAN_TERTIARY_KEY);
      const savedHelmet = localStorage.getItem(H3_SPARTAN_HEAD_KEY);
      const savedLeftShoulder = localStorage.getItem(H3_SPARTAN_LEFT_SHOULDER_KEY);
      const savedRightShoulder = localStorage.getItem(H3_SPARTAN_RIGHT_SHOULDER_KEY);
      const savedBody = localStorage.getItem(H3_SPARTAN_BODY_KEY);

      if (savedPrimary) {
        this.primaryColor.set(new Color(savedPrimary));
      }
      if (savedSecondary) {
        this.secondaryColor.set(new Color(savedSecondary));
      }
      if (savedTertiary) {
        this.tertiaryColor.set(new Color(savedTertiary));
      }
      if (savedHelmet) {
        this.helmet.set(parseInt(savedHelmet, 10));
      }
      if (savedLeftShoulder) {
        this.leftShoulder.set(parseInt(savedLeftShoulder, 10));
      }
      if (savedRightShoulder) {
        this.rightShoulder.set(parseInt(savedRightShoulder, 10));
      }
      if (savedBody) {
        this.body.set(parseInt(savedBody, 10));
      }
    }

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_PRIMARY_KEY, this.primaryHex());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_SECONDARY_KEY, this.secondaryHex());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_TERTIARY_KEY, this.tertiaryHex());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_HEAD_KEY, this.helmet().toString());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_LEFT_SHOULDER_KEY, this.leftShoulder().toString());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_RIGHT_SHOULDER_KEY, this.rightShoulder().toString());
      }
    });

    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(H3_SPARTAN_BODY_KEY, this.body().toString());
      }
    });
  }

  setPrimaryHex(hex: string) {
    this.primaryColor.set(new Color(hex));
  }

  setSecondaryHex(hex: string) {
    this.secondaryColor.set(new Color(hex));
  }

  setTertiaryHex(hex: string) {
    this.tertiaryColor.set(new Color(hex));
  }

  setHelmet(armor: H3Armors) {
    this.helmet.set(armor);
  }

  setLeftShoulder(armor: H3Armors) {
    this.leftShoulder.set(armor);
  }

  setRightShoulder(armor: H3Armors) {
    this.rightShoulder.set(armor);
  }

  setBody(armor: H3Armors) {
    this.body.set(armor);
  }
  
  onCameraChange(pos: Vector3) {
    this.cameraPos.set(pos);
  }
}