import { TestBed } from '@angular/core/testing';

import { Credito } from './credito';

describe('Credito', () => {
  let service: Credito;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Credito);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
