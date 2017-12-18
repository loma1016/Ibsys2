import { TestBed, inject } from '@angular/core/testing';

import { ProductionPlanningService } from './production-planning.service';

describe('ProductionPlanningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionPlanningService]
    });
  });

  it('should ...', inject([ProductionPlanningService], (service: ProductionPlanningService) => {
    expect(service).toBeTruthy();
  }));
});
