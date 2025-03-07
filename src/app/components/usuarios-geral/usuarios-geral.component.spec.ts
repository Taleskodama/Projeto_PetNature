import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosGeralComponent } from './usuarios-geral.component';

describe('UsuariosGeralComponent', () => {
  let component: UsuariosGeralComponent;
  let fixture: ComponentFixture<UsuariosGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosGeralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
