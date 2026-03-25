import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mispagos } from './mispagos';

describe('Mispagos', () => {
  let component: Mispagos;
  let fixture: ComponentFixture<Mispagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mispagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mispagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
