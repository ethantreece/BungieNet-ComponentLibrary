import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	effect,
} from '@angular/core';
import { NgtArgs } from 'angular-three';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { gltfResource } from 'angular-three-soba/loaders';
import { NgtsCenter, NgtsEnvironment } from 'angular-three-soba/staging';
import { Color, Mesh, MeshStandardMaterial, NoColorSpace, SRGBColorSpace, Texture, TextureLoader, WebGLProgramParametersWithUniforms } from 'three';
import { GLTF } from 'three-stdlib';

@Component({
  selector: 'app-scene-component',
  template: `        
    <ngts-center>
      <ngt-primitive *args="[gltf.scene()]" />
    </ngts-center>

    <ngt-ambient-light [intensity]="1" />
    <ngt-directional-light
      [position]="[10, 10, 10]"
      [intensity]="10"
      [castShadow]="true"
    />

    <ngts-environment [options]="{ preset: 'sunset', background: false, blur: 0.5 }" />

    <ngts-camera-controls />
  `,
  imports: [NgtArgs, NgtsCameraControls, NgtsEnvironment, NgtsCenter],  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneComponent implements OnInit {

  protected gltf = gltfResource<GLTF>(() => '3d/test_3.glb');
  
  primaryColor = new Color('#ff0000');
  secondaryColor = new Color('#00ff00');

  ccMask!: Texture<HTMLImageElement>;

  ngOnInit(): void {
    this.ccMask = new TextureLoader().load('3d/masterchief_cc.png');
    this.ccMask.colorSpace = NoColorSpace;
  }

  constructor() {
    effect(() => {
      const scene = this.gltf.scene();
      if (!scene) return;

      scene.traverse(obj => {
        if (!(obj instanceof Mesh)) return;

        const mat = obj.material;
        if (Array.isArray(mat)) return;

        console.log('Patching material for CC:', mat.name, obj, mat);

        if (
          mat instanceof MeshStandardMaterial &&
          mat.map &&
          mat.name !== 'masterchief_visor'
        ) {

          // Prevent double-patching
          if ((mat as any).__ccPatched) return;
          (mat as any).__ccPatched = true;

          mat.onBeforeCompile = shader => {
            this.addColors(shader, this.ccMask);
          };

          mat.needsUpdate = true;
        } else if (mat.name === 'masterchief_visor') {
          if (!(mat instanceof MeshStandardMaterial)) return;

          // Base gold color
          mat.color.set('#d4a017'); // rich gold

          // Physical properties
          mat.metalness = 1.0;
          mat.roughness = 0.1; // smooth, glassy

          // Make reflections pop
          mat.envMapIntensity = 2.5;

          // Slight emissive glow (Blender-like)
          mat.emissive.set('#553300');
          mat.emissiveIntensity = 0.4;

          // Optional: tint texture if one exists
          if (mat.map) {
            mat.map.colorSpace = SRGBColorSpace;
          }

          // Ensure correct lighting update
          mat.needsUpdate = true;
        }

      });
    });
  }

  addColors(shader: WebGLProgramParametersWithUniforms, ccMask: Texture<HTMLImageElement>): void {
    // Uniforms
    shader.uniforms['primaryColor'] = { value: this.primaryColor };
    shader.uniforms['secondaryColor'] = { value: this.secondaryColor };
    shader.uniforms['ccMask'] = { value: ccMask };

    // Declare uniforms
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>

      uniform vec3 primaryColor;
      uniform vec3 secondaryColor;
      uniform sampler2D ccMask;
      `
    );

    // Apply CC logic using Three.js UVs
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #include <map_fragment>

      vec4 mask = texture(ccMask, vMapUv);

      diffuseColor.rgb *=
        mask.r * primaryColor +
        mask.g * secondaryColor +
        mask.b;
      `
    );
  }

};
