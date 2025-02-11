import { TestBed } from '@angular/core/testing';

import { AgentservicesService } from './agentservices.service';

describe('AgentservicesService', () => {
  let service: AgentservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
