import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacePlaningComponent } from './workspace-planing.component';

describe('WorkspacePlaningComponent', () => {
  let component: WorkspacePlaningComponent;
  let fixture: ComponentFixture<WorkspacePlaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacePlaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacePlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
