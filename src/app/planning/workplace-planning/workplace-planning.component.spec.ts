import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacePlanningComponent } from './workplace-planning.component';

describe('WorkspacePlanningComponent', () => {
  let component: WorkspacePlanningComponent;
  let fixture: ComponentFixture<WorkspacePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspacePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
