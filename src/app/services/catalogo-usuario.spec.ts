import { TestBed } from '@angular/core/testing';

import { CatalogoUsuario } from './catalogo-usuario';

describe('CatalogoUsuario', () => {
  let service: CatalogoUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
