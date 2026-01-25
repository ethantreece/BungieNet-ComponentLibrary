import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { HaloForumButton } from "../../shared/components/halo-forum-button/halo-forum-button";
import { HaloSpinner } from "../../shared/components/halo-spinner/halo-spinner";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatTooltipModule } from '@angular/material/tooltip';

type ComponentType = 'button' | 'spinner';

@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.html',
  styleUrl: './components-page.css',
  imports: [HaloForumButton, HaloSpinner, MatSlideToggle, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsPage {
  protected readonly selectedComponent = signal<ComponentType>('button');
  protected readonly defaultVisible = signal(true);

  selectComponent(component: ComponentType): void {
    this.selectedComponent.set(component);
  }

  toggleDefaultVisible(): void {
    this.defaultVisible.set(!this.defaultVisible());
  }
}
