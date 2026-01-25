import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	booleanAttribute,
	effect,
  input,
  signal,
} from '@angular/core';
import { injectBeforeRender, NgtArgs, NGT_STORE } from 'angular-three';
import { gltfResource } from 'angular-three-soba/loaders';
import { NgtsCenter, NgtsEnvironment } from 'angular-three-soba/staging';
import { Color, Mesh, MeshStandardMaterial, NoColorSpace, Texture, TextureLoader, Vector3, WebGLProgramParametersWithUniforms, SkinnedMesh, Bone } from 'three';
import { GLTF } from 'three-stdlib';
import {
	TweakpaneCheckbox,
	TweakpaneColor,
	TweakpaneFolder,
	TweakpaneList,
	TweakpaneNumber,
	TweakpanePane,
} from 'angular-three-tweakpane';
import { NgtpBloom, NgtpEffectComposer, NgtpGlitch } from 'angular-three-postprocessing';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import { AnimationMixer } from 'three';
import { inject, output } from '@angular/core';

@Component({
  selector: 'app-model',
  template: `
    <ngt-group [position]="[0, -33, 0]">
      <ngt-primitive *args="[gltf.scene()]" />
    </ngt-group>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Model implements OnInit {

	protected Math = Math;

  /**
   * For this to work, I had to export from Blender with Data > Armature > Use Rest Position disabled.
   * The gun is then attached to the hand bone here in code instead of in Blender, and with the rest
   * position being the first frame of the animation, it stays put correctly.
   */
  protected gltf = gltfResource<GLTF>(() => '3d/spartan_idle_with_rifle_reset_rest.glb');

  private mixer!: AnimationMixer;
  private weaponAttached = false;

  // 🎨 CUSTOM COLORS
  primaryColor = input.required<Color>();
  secondaryColor = input.required<Color>();

  ccMask!: Texture<HTMLImageElement>;

  ngOnInit(): void {
    this.ccMask = new TextureLoader().load('3d/masterchief_cc.png');
    this.ccMask.colorSpace = NoColorSpace;
  }

  constructor() {

    injectBeforeRender(({ delta }) => {
      if (this.mixer) {
        this.mixer.update(delta);
      }
    });

    effect(() => {
      // Read color signals first to ensure they're tracked as dependencies
      const primaryColor = this.primaryColor();
      const secondaryColor = this.secondaryColor();

      const scene = this.gltf.scene();
      if (!scene || !this.ccMask) return;

      if (!this.mixer && this.gltf.value()?.animations.length) {
        this.mixer = new AnimationMixer(scene);

        const clip = this.gltf.value()?.animations[0];
        if (clip) {
          this.mixer.clipAction(clip).play();
        }
      }

      // Attach battle rifle to a hand/weapon bone once
      if (!this.weaponAttached) {
        // Find a hand/weapon bone
        let handBone = scene.getObjectByName('r_ring2');
        let gun = scene.getObjectByName('battle_rifle');

        // Attach while preserving world transform
        if (gun && handBone) {
          handBone.attach(gun);
          this.weaponAttached = true;
        }
      }

      scene.traverse(obj => {
        if (!(obj instanceof Mesh)) return;

        const mat = obj.material;
        if (Array.isArray(mat)) return;

        // ARMOR MATERIAL
        if (
          mat instanceof MeshStandardMaterial &&
          mat.map &&
          mat.name === 'masterchief'
        ) {
          if (!(mat as any).__ccPatched) {
            (mat as any).__ccPatched = true;

            mat.onBeforeCompile = shader => {
              shader.uniforms['primaryColor'] = { value: primaryColor };
              shader.uniforms['secondaryColor'] = { value: secondaryColor };
              shader.uniforms['ccMask'] = { value: this.ccMask };

              mat.userData['ccUniforms'] = shader.uniforms;

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform vec3 primaryColor;
                uniform vec3 secondaryColor;
                uniform sampler2D ccMask;
                `
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #include <map_fragment>

                vec4 mask = texture2D(ccMask, vMapUv);

                diffuseColor.rgb *=
                  mask.r * primaryColor +
                  mask.g * secondaryColor +
                  mask.b;
                `
              );
            };

            mat.needsUpdate = true;
          }

          console.log('updating colors', mat.userData);

          const uniforms = mat.userData?.['ccUniforms'];
          if (uniforms) {
            uniforms.primaryColor.value.copy(primaryColor);
            uniforms.secondaryColor.value.copy(secondaryColor);
          }
        }
        // VISOR MATERIAL
        else if (mat.name === 'masterchief_visor' && mat instanceof MeshStandardMaterial) {
          mat.color.set('#d4a017');
          mat.metalness = 1.0;
          mat.roughness = 0.1;
          mat.envMapIntensity = 2.5;
          mat.emissive.set('#553300');
          mat.emissiveIntensity = 0.4;
          mat.needsUpdate = true;
        }
      });
    });
  }
};


@Component({
	selector: 'app-scene-component',
	template: `
		<ngt-ambient-light [intensity]="0.4" />
		<ngt-point-light [intensity]="Math.PI * 2" [decay]="1" [position]="[2, 2, 2]" [color]="'#3FA2FC'" />
		<ngt-point-light [intensity]="Math.PI" [decay]="1" [position]="[-2, 1, -2]" [color]="'#ffffff'" />

		<app-model [primaryColor]="primaryColor()" [secondaryColor]="secondaryColor()" />

		<ngtp-effect-composer>
      <ngtp-bloom
        [options]="{
          kernelSize: 3,
          luminanceThreshold: 0.1,
          luminanceSmoothing: 0.2,
          intensity: 0.5,
        }"
      />

      <ngts-environment [options]="{
          preset: 'studio',
          background: false,
        }"   
      />
		</ngtp-effect-composer>

    <ngts-orbit-controls [options]="{ makeDefault: true }" />
	`,
	imports: [
    NgtsEnvironment,
		NgtsOrbitControls,
		// NgtArgs,
		Model,
		NgtpEffectComposer,
		NgtpBloom,
		// NgtpGlitch,
		// TweakpanePane,
		// TweakpaneFolder,
		// TweakpaneCheckbox,
		// TweakpaneList,
		// TweakpaneColor,
		// TweakpaneNumber,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	host: { class: 'soba-experience' },
})
export class SceneComponent {
	protected Math = Math;

  primaryColor = input.required<Color>();
  secondaryColor = input.required<Color>();

  cameraChange = output<Vector3>();

  constructor() {
    injectBeforeRender(({ camera }) => {
      this.cameraChange.emit(camera.position);
    });
  }

  protected bloom = signal(false);
  protected glitch = signal(false);
  protected selectedEnvironment = signal<"apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" | undefined>('sunset');

	protected backgroundColor = signal('#898989');

	protected luminanceThreshold = signal(0);
	protected luminanceSmoothing = signal(0.4);
	protected intensity = signal(1.5);

	asRenderTexture = input(false, { transform: booleanAttribute });
}
