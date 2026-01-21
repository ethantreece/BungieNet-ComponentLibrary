// import { booleanAttribute, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit, signal } from "@angular/core";
// import { NgtArgs } from "angular-three";
// import { NgtsCenter } from "angular-three-soba/staging";
// import { GLTF } from 'three-stdlib';
// import { gltfResource } from 'angular-three-soba/loaders';

import {
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
import { Bone, Group, MeshStandardMaterial, Object3D, SRGBColorSpace, SkinnedMesh } from 'three';
import { GLTF } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-scene-component',
  template: `        
    <ngts-center>
      <ngt-primitive *args="[gltf.scene()]" [parameters]="{ scale: 1 }" />
    </ngts-center>

    <ngts-environment [options]="{ preset: 'city' }" />

    <ngts-camera-controls />
  `,
  imports: [NgtArgs, NgtsCameraControls, NgtsEnvironment, NgtsCenter],  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneComponent {

  protected gltf = gltfResource<GLTF>(() => '3d/h2_spartan.glb');
};
