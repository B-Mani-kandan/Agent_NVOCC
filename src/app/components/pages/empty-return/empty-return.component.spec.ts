import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyReturnComponent } from './empty-return.component';

describe('EmptyReturnComponent', () => {
  let component: EmptyReturnComponent;
  let fixture: ComponentFixture<EmptyReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
