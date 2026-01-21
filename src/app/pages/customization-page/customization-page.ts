import { Component } from "@angular/core";
import { NgtCanvasContent } from "angular-three/dom";
import { NgtCanvas } from "angular-three/dom";
import { SceneComponent } from "../../shared/components/scene-component/scene-component";

@Component({
  selector: 'app-customization-page',
  templateUrl: './customization-page.html',
  styleUrl: './customization-page.css',
  imports: [NgtCanvasContent, NgtCanvas, SceneComponent],
})
export class CustomizationPage {
  scene?: SceneComponent;  
};