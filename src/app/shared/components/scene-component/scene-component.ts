// import { booleanAttribute, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit, signal } from "@angular/core";
// import { NgtArgs } from "angular-three";
// import { NgtsCenter } from "angular-three-soba/staging";
// import { GLTF } from 'three-stdlib';
// import { gltfResource } from 'angular-three-soba/loaders';

import {
  AfterViewInit,
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	Directive,
	ElementRef,
	booleanAttribute,
	computed,
	effect,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { NgtArgs, loaderResource } from 'angular-three';
import { NgtpBloom, NgtpEffectComposer, NgtpGlitch } from 'angular-three-postprocessing';
import { NgtsCameraControls, NgtsOrbitControls } from 'angular-three-soba/controls';
import { gltfResource } from 'angular-three-soba/loaders';
import { NgtsAnimation, animations } from 'angular-three-soba/misc';
import { matcapTextureResource, NgtsCenter, NgtsEnvironment } from 'angular-three-soba/staging';
import {
	TweakpaneCheckbox,
	TweakpaneColor,
	TweakpaneFolder,
	TweakpaneList,
	TweakpaneNumber,
	TweakpanePane,
} from 'angular-three-tweakpane';
import { Bone, Color, Group, Mesh, MeshStandardMaterial, NoColorSpace, Object3D, SRGBColorSpace, SkinnedMesh, TextureLoader } from 'three';
import { GLTF } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-scene-component',
  template: `        
    <ngts-center>
      <ngt-primitive *args="[gltf.scene()]" />
    </ngts-center>

    <ngt-ambient-light [intensity]="2" />
    <ngt-directional-light
      [position]="[10, 10, 10]"
      [intensity]="10"
      [castShadow]="true"
    />

    <ngts-environment />
    <ngts-camera-controls />
  `,
  imports: [NgtArgs, NgtsCameraControls, NgtsEnvironment, NgtsCenter],  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneComponent {

  protected gltf = gltfResource<GLTF>(() => '3d/test_3.glb');
  
  primaryColor = new Color('#ff0000');
  secondaryColor = new Color('#00ff00');

    constructor() {

    const ccMask = new TextureLoader().load('3d/masterchief_cc.tif');
    ccMask.colorSpace = NoColorSpace;

    effect(() => {
      const scene = this.gltf.scene();
      if (!scene) return;

      scene.traverse(obj => {
        console.log("Traversing object:", obj);
        if (!(obj instanceof Mesh)) return;

        const mat = obj.material;
        if (Array.isArray(mat)) return;

        // mat.color.set(this.primaryColor);
      });
    });
  }

  // constructor() {
  //   effect(() => {
  //     const scene = this.gltf.scene();
  //     if (!scene) return;

  //     const ccMask = new TextureLoader().load('3d/masterchief_cc.tif');
  //     ccMask.colorSpace = NoColorSpace;

  //     console.log("Scene loaded:", scene);
  //     scene.traverse(obj => {
        
  //       if (!(obj instanceof Mesh)) return;

  //       console.log("Mesh found:", obj);

  //       const mat = obj.material;

  //       if (Array.isArray(mat)) return;

  //       if (mat instanceof MeshStandardMaterial) {
  //         // mat.color.set('#ff0000');
  //         // mat.needsUpdate = true;

  //         mat.onBeforeCompile = (shader) => {
  //           console.log("Modifying shader for mesh:", shader);

  //           // Inject uniforms
  //           shader.uniforms['primaryColor'] = { value: this.primaryColor };
  //           shader.uniforms['secondaryColor'] = { value: this.secondaryColor };
  //           shader.uniforms['ccMask'] = { value: ccMask };

  //           // Vertex: pass UVs
  //           shader.vertexShader = shader.vertexShader.replace(
  //             '#include <uv_vertex>',
  //             `
  //             #include <uv_vertex>
  //             vUv = uv;
  //             `
  //           );

  //           // Fragment: apply mask logic
  //           shader.fragmentShader = shader.fragmentShader.replace(
  //             '#include <map_fragment>',
  //             `
  //             vec4 baseColor = texture2D(map, vUv);
  //             vec4 mask = texture2D(ccMask, vUv);

  //             vec3 colored =
  //               baseColor.rgb * (
  //                 mask.r * primaryColor +
  //                 mask.g * secondaryColor +
  //                 mask.b
  //               );

  //             diffuseColor.rgb = colored;
  //             `
  //           );

  //         };

  //         mat.needsUpdate = true;

  //       }


  //     });
  //   })
  // }

  // constructor() {

  //   const ccMask = new TextureLoader().load('3d/masterchief_cc.tif');
  //   ccMask.colorSpace = NoColorSpace;

  //   effect(() => {
  //     const scene = this.gltf.scene();
  //     if (!scene) return;

  //     scene.traverse(obj => {
  //       console.log("Traversing object:", obj);
  //       if (!(obj instanceof Mesh)) return;

  //       const mat = obj.material;
  //       if (Array.isArray(mat)) return;

  //       if (
  //         mat instanceof MeshStandardMaterial &&
  //         mat.map &&
  //         mat.name !== 'masterchief_visor'
  //       ) {

  //         mat.onBeforeCompile = (shader) => {

  //           // 1️⃣ Inject uniforms
  //           shader.uniforms['primaryColor'] = { value: this.primaryColor };
  //           shader.uniforms['secondaryColor'] = { value: this.secondaryColor };
  //           shader.uniforms['ccMask'] = { value: ccMask };

  //           // 2️⃣ Declare uniforms in fragment shader
  //           shader.fragmentShader = shader.fragmentShader.replace(
  //             '#include <common>',
  //             `
  //             #include <common>

  //             uniform vec3 primaryColor;
  //             uniform vec3 secondaryColor;
  //             uniform sampler2D ccMask;
  //             `
  //           );

  //           // 3️⃣ Patch map fragment (vUv already exists!)
  //           // shader.fragmentShader = shader.fragmentShader.replace(
  //           //   '#include <map_fragment>',
  //           //   `
  //           //   #include <map_fragment>

  //           //   vec4 mask = texture2D(ccMask, vUv);

  //           //   diffuseColor.rgb *=
  //           //     mask.r * primaryColor +
  //           //     mask.g * secondaryColor +
  //           //     mask.b;
  //           //   `
  //           // );
  //           shader.fragmentShader = shader.fragmentShader.replace(
  //             '#include <map_fragment>',
  //             `
  //             #include <map_fragment>

  //             vec4 mask = texture(ccMask, vMapUv);

  //             diffuseColor.rgb *=
  //               mask.r * primaryColor +
  //               mask.g * secondaryColor +
  //               mask.b;
  //             `
  //           );

  //         };
  //         mat.needsUpdate = true;
  //         console.log(`Customized material: ${mat.name}`, mat);
  //       }
  //     });
  //   });
  // }

};
