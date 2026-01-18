import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaloForumButton } from './halo-forum-button';

describe('HaloForumButton', () => {
  let component: HaloForumButton;
  let fixture: ComponentFixture<HaloForumButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaloForumButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaloForumButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
