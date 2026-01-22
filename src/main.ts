import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import ResizeObserver from 'resize-observer-polyfill';

(window as any).ResizeObserver = ResizeObserver;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
