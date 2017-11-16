import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD:src/app/planning/planning.component.spec.ts
import { PlaningComponent } from './planning.component';
=======
import { PlanningComponent } from './planning.component';
>>>>>>> master:src/app/planning/planning.component.spec.ts

describe('PlanningComponent', () => {
  let component: PlanningComponent;
  let fixture: ComponentFixture<PlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
