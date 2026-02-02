import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { H3Armors, H3ArmorDisplayNames, SpartanArmorOptions } from '../../models/h3_armor';
import { h3ColorPalette } from '../../models/colors';

type MenuTab = 'ARMORY' | 'COLORS' | 'EMBLEM';
type ArmorCategory = 'HELMET' | 'LEFT_SHOULDER' | 'RIGHT_SHOULDER' | 'BODY';
type ColorCategory = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

@Component({
  selector: 'app-customization-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customization-menu.component.html',
  styleUrl: './customization-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizationMenuComponent {
  // Inputs for current state
  helmet = input.required<H3Armors>();
  leftShoulder = input.required<H3Armors>();
  rightShoulder = input.required<H3Armors>();
  body = input.required<H3Armors>();

  primaryHex = input.required<string>();
  secondaryHex = input.required<string>();
  tertiaryHex = input.required<string>();

  // Outputs for state changes
  helmetChange = output<H3Armors>();
  leftShoulderChange = output<H3Armors>();
  rightShoulderChange = output<H3Armors>();
  bodyChange = output<H3Armors>();

  primaryHexChange = output<string>();
  secondaryHexChange = output<string>();
  tertiaryHexChange = output<string>();

  // Internal UI State
  activeTab = signal<MenuTab>('ARMORY');
  activeArmorCategory = signal<ArmorCategory>('HELMET');
  activeColorCategory = signal<ColorCategory>('PRIMARY');

  // Logic Links
  colors = h3ColorPalette;
  armorDisplayNames = H3ArmorDisplayNames;

  // Computed helper to get options for current armor category
  currentArmorOptions = computed(() => {
    const category = this.activeArmorCategory();
    let options: H3Armors[] = [];
    
    switch (category) {
      case 'HELMET': options = SpartanArmorOptions.helmets; break;
      case 'LEFT_SHOULDER': options = SpartanArmorOptions.shoulders; break;
      case 'RIGHT_SHOULDER': options = SpartanArmorOptions.shoulders; break;
      case 'BODY': options = SpartanArmorOptions.chests; break;
    }

    return options.map(id => ({
      id,
      name: this.armorDisplayNames[id]
    }));
  });

  isArmorSelected(id: H3Armors): boolean {
    const category = this.activeArmorCategory();
    switch (category) {
      case 'HELMET': return this.helmet() === id;
      case 'LEFT_SHOULDER': return this.leftShoulder() === id;
      case 'RIGHT_SHOULDER': return this.rightShoulder() === id;
      case 'BODY': return this.body() === id;
    }
    return false;
  }

  selectArmor(id: H3Armors) {
    const category = this.activeArmorCategory();
    switch (category) {
      case 'HELMET': this.helmetChange.emit(id); break;
      case 'LEFT_SHOULDER': this.leftShoulderChange.emit(id); break;
      case 'RIGHT_SHOULDER': this.rightShoulderChange.emit(id); break;
      case 'BODY': this.bodyChange.emit(id); break;
    }
  }

  isColorSelected(hex: string): boolean {
    const category = this.activeColorCategory();
    const targetHex = category === 'PRIMARY' ? this.primaryHex() : 
                      category === 'SECONDARY' ? this.secondaryHex() : 
                      this.tertiaryHex();
    return targetHex.toLowerCase() === hex.toLowerCase();
  }

  selectColor(hex: string) {
    const category = this.activeColorCategory();
    switch (category) {
      case 'PRIMARY': this.primaryHexChange.emit(hex); break;
      case 'SECONDARY': this.secondaryHexChange.emit(hex); break;
      case 'TERTIARY': this.tertiaryHexChange.emit(hex); break;
    }
  }

  selectedArmorName = computed(() => {
    // Determine which armor is currently "active" in the UI focus to show description
    // For now, let's just show the description of the currently equipped item of the active category
    // OR we could track a "hovered" or "focused" item in the grid.
    // For this simple version, let's just show the category name or something generic, 
    // BUT the referenced UI shows descriptions for specific items.
    // Let's defer description for the *category* active item.
    
    const category = this.activeArmorCategory();
    let currentId: H3Armors;

    switch (category) {
      case 'HELMET': currentId = this.helmet(); break;
      case 'LEFT_SHOULDER': currentId = this.leftShoulder(); break;
      case 'RIGHT_SHOULDER': currentId = this.rightShoulder(); break;
      case 'BODY': currentId = this.body(); break;
      default: return '';
    }
    return this.armorDisplayNames[currentId];
  });

  selectedColorName = computed(() => {
     const category = this.activeColorCategory();
     const hex = category === 'PRIMARY' ? this.primaryHex() :
                 category === 'SECONDARY' ? this.secondaryHex() :
                 this.tertiaryHex();
     
     const match = this.colors.find(c => c.hex.toLowerCase() === hex.toLowerCase());
     return match ? match.name : 'Custom';
  });

  getArmorDescription(name: string): string {
    // Placeholder descriptions
    const descriptions: {[key: string]: string} = {
      'Mark VI': 'The Mjolnir Mark VI Powered Assault Armor is the latest in UNSC technology.',
      'C.Q.B.': 'Close Quarters Battle armor variant, designed for boarding actions and urban combat.',
      'E.V.A.': 'Extra-Vehicular Activity armor, specialized for zero-G vacuum environments.',
      'E.O.D.': 'Explosive Ordnance Disposal armor, built to withstand extreme pressure and heat.',
      'Hayabusa': 'Powered armor developed by the Earth-based Hayabusa company.',
      'Security': 'Used byoni security personnel on sensitive installations.',
      'Scout': 'Stealth-capable armor with advanced sensors for reconnaissance.',
      'ODST': 'Orbital Drop Shock Trooper armor, adapted for Spartan use.',
      'Mark V': 'The classic Mjolnir Mark V Powered Assault Armor.',
      'Rogue': 'A private variant often used by Spartans operating alone.',
      'Recon': 'Specialized armor for deep reconnaissance missions.',
    };
    return descriptions[name] || `Standard issue UNSC armor variant: ${name}.`;
  }
}
