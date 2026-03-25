import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaInmueble } from './alta-inmueble';

describe('AltaInmueble', () => {
  let component: AltaInmueble;
  let fixture: ComponentFixture<AltaInmueble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaInmueble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaInmueble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
