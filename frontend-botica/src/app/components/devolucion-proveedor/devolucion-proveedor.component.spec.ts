import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionProveedorComponent } from './devolucion-proveedor.component';

describe('DevolucionProveedorComponent', () => {
  let component: DevolucionProveedorComponent;
  let fixture: ComponentFixture<DevolucionProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DevolucionProveedorComponent]
    });
    fixture = TestBed.createComponent(DevolucionProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
