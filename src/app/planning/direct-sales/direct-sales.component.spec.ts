import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSalesComponent } from './direct-sales.component';

describe('DirectSalesComponent', () => {
  let component: DirectSalesComponent;
  let fixture: ComponentFixture<DirectSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
