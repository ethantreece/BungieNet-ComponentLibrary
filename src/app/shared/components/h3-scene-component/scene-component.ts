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
import { Color, Mesh, MeshStandardMaterial, NoColorSpace, Texture, TextureLoader, Vector3, WebGLProgramParametersWithUniforms, SkinnedMesh, Bone, LoopOnce } from 'three';
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
import { H3ArmorNames, H3Armors } from '../../models/h3_armor';

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
export class Model {

  /**
   * For this to work, I had to export from Blender with Data > Armature > Use Rest Position disabled.
   * The gun is then attached to the hand bone here in code instead of in Blender, and with the rest
   * position being the first frame of the animation, it stays put correctly.
   */
  protected gltf = gltfResource<GLTF>(() => '3d/h3/spartan/spartan.glb');
	protected Math = Math;
  private mixer!: AnimationMixer;
  private weaponAttached = false;

  // 🎨 CUSTOM COLORS
  primaryColor = input.required<Color>();
  secondaryColor = input.required<Color>();
  tertiaryColor = input.required<Color>();

  helmet = input.required<H3Armors>();
  leftShoulder = input.required<H3Armors>();
  rightShoulder = input.required<H3Armors>();
  body = input.required<H3Armors>();
  
  loading = signal(true);

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
      const tertiaryColor = this.tertiaryColor();

      const helmet = this.helmet();
      const leftShoulder = this.leftShoulder();
      const rightShoulder = this.rightShoulder();
      const body = this.body();

      const scene = this.gltf.scene();
      if (!scene) return;

      if (!this.mixer && this.gltf.value()?.animations.length) {
        this.mixer = new AnimationMixer(scene);

        const animations = this.gltf.value()?.animations || [];

        const intro1 = animations[2];
        const intro2 = animations[3];
        const loopAction = animations[0];

        if (intro1 && loopAction) {
          const action1 = this.mixer.clipAction(intro1);
          const action2 = this.mixer.clipAction(intro2);
          const loopingAction = this.mixer.clipAction(loopAction);

          action1.setLoop(LoopOnce, 1);
          action1.clampWhenFinished = true;

          action2.setLoop(LoopOnce, 1);
          action2.clampWhenFinished = true;

          action1.play();

          // When intro finishes, start looping action
          this.mixer.addEventListener('finished', (e) => {
            if (e.action === action1) {
              action2.reset().play();
            } else if (e.action === action2) {
              loopingAction.reset().play();
            }
          });
        }
      }

      if (!this.weaponAttached) {
        // Find a hand/weapon bone
        let handBone = scene.getObjectByName('r_ring_mid');
        let gun = scene.getObjectByName('assault_rifle');

        // Attach while preserving world transform
        if (gun && handBone) {
          handBone.attach(gun);
          this.weaponAttached = true;
        }
      }
      
      const armors = new Set<string>();
      armors.add(H3ArmorNames[helmet]);
      armors.add(H3ArmorNames[leftShoulder]);
      armors.add(H3ArmorNames[rightShoulder]);
      armors.add(H3ArmorNames[body]);

      scene.traverse(obj => {
        console.log('Armor Parts Visibility Update:', obj);

        if (obj.type === 'Object3D') {
          obj.children.forEach(child => {

            
            console.log('   - child:', child.name);

            if (child.name.startsWith('helmet')) {
              child.visible = child.name === `helmet${H3ArmorNames[helmet]}`;
            } else if (child.name.startsWith('leftshoulder')) {
              child.visible = child.name === `leftshoulder${H3ArmorNames[leftShoulder]}`;
            } else if (child.name.startsWith('rightshoulder')) {
              child.visible = child.name === `rightshoulder${H3ArmorNames[rightShoulder]}`;
            } else if (child.name.startsWith('chest')) {
              child.visible = child.name === `chest${H3ArmorNames[body]}`;
            }
          });
        }

        if (!(obj instanceof Mesh)) return;

        const mat = obj.material;
        if (Array.isArray(mat)) return;

        console.log('Material Check:', mat.name);

        // ARMOR MATERIAL
        if (
          mat instanceof MeshStandardMaterial &&
          mat.map &&
          (Object.values(H3ArmorNames).includes(mat.name) || mat.name === 'mp_masterchief' || mat.name === 'mp_personal_decals')
        ) {
          if (!(mat as any).__ccPatched) {
            (mat as any).__ccPatched = true;
            
            const ccMask = new TextureLoader().load(`3d/h3/spartan/${mat.name}_cc.png`);
            ccMask.colorSpace = NoColorSpace;
            ccMask.flipY = false;

            mat.onBeforeCompile = (shader) => {

              shader.uniforms['primaryColor'] = { value: primaryColor };
              shader.uniforms['secondaryColor'] = { value: secondaryColor };
              shader.uniforms['tertiaryColor'] = { value: tertiaryColor };
              shader.uniforms['ccMask'] = { value: ccMask };

              mat.userData['ccUniforms'] = shader.uniforms;

              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform vec3 primaryColor;
                uniform vec3 secondaryColor;
                uniform vec3 tertiaryColor;
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
                  mask.b * tertiaryColor;
                `
              );
            };

            mat.needsUpdate = true;
          }

          const uniforms = mat.userData?.['ccUniforms'];
          if (uniforms) {
            uniforms.primaryColor.value.copy(primaryColor);
            uniforms.secondaryColor.value.copy(secondaryColor);
            uniforms.tertiaryColor.value.copy(tertiaryColor);
          }
        } else if (mat instanceof MeshStandardMaterial && mat.name.includes('visor')) {
          // mat.color.set('#ffffff');
          mat.metalness = 1.0;
          mat.roughness = 0.1;
          // mat.envMapIntensity = 25;
          // mat.emissive.set('#e0dad0');
          // mat.emissiveIntensity = 0.03;
          mat.needsUpdate = true;
        } else if (mat.name === 'mc_emblem') {
          // Hide emblem until implemented
          mat.visible = false;
        } else if (mat.name === 'mp_personal_decals') {
          console.log('Setting Tertiary Color on mp_personal_decals');
          mat.color.set(tertiaryColor);
        } else if (mat.name === 'decalsbase') {
          console.log('Setting Tertiary Color on mp_personal_decals');
          mat.color.set(tertiaryColor);
        }
      });
    });
  }
};


@Component({
	selector: 'app-h3-scene-component',
	template: `
		<ngt-ambient-light [intensity]="0.04" />
		<!-- <ngt-point-light [intensity]="Math.PI * 2" [decay]="1" [position]="[2, 2, 2]" [color]="'#3FA2FC'" />
		<ngt-point-light [intensity]="Math.PI" [decay]="1" [position]="[-2, 1, -2]" [color]="'#ffffff'" /> -->

		<app-model
      [primaryColor]="primaryColor()"
      [secondaryColor]="secondaryColor()"
      [tertiaryColor]="tertiaryColor()"
      [helmet]="helmet()"
      [leftShoulder]="leftShoulder()"
      [rightShoulder]="rightShoulder()"
      [body]="body()"
      [weaponRotX]="weaponRotX()"
      [weaponRotY]="weaponRotY()"
      [weaponRotZ]="weaponRotZ()"
    />

		<ngtp-effect-composer>
      <ngtp-bloom
        [options]="{
          kernelSize: 3,
          luminanceThreshold: 0.1,
          luminanceSmoothing: 0.2,
          intensity: 0.05,
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
		Model,
		NgtpEffectComposer,
		NgtpBloom,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	host: { class: 'soba-experience' },
})
export class H3SceneComponent {
	protected Math = Math;

  primaryColor = input.required<Color>();
  secondaryColor = input.required<Color>();
  tertiaryColor = input.required<Color>();
  helmet = input.required<H3Armors>();
  leftShoulder = input.required<H3Armors>();
  weaponRotX = input(2.0);
  weaponRotY = input(-2.1);
  weaponRotZ = input(-0.1);

  rightShoulder = input.required<H3Armors>();
  body = input.required<H3Armors>();

  cameraChange = output<Vector3>();

  constructor() {
    injectBeforeRender(({ camera }) => {
      this.cameraChange.emit(camera.position);
    });
  }

  protected bloom = signal(false);
  protected glitch = signal(false);
  protected selectedEnvironment = signal<"apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" | undefined>('sunset');

	protected luminanceThreshold = signal(0);
	protected luminanceSmoothing = signal(0.4);
	protected intensity = signal(1.5);

	asRenderTexture = input(false, { transform: booleanAttribute });
}
