import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhelperComponent } from './addhelper.component';

describe('AddhelperComponent', () => {
  let component: AddhelperComponent;
  let fixture: ComponentFixture<AddhelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddhelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddhelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
