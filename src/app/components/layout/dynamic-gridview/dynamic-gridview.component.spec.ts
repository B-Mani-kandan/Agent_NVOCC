import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridviewComponent } from './dynamic-gridview.component';

describe('DynamicGridviewComponent', () => {
  let component: DynamicGridviewComponent;
  let fixture: ComponentFixture<DynamicGridviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicGridviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicGridviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
