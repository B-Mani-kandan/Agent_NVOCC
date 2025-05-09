import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabPanelComponent } from './tabpanel.component';

describe('TabPanelComponent', () => {
  let component: TabPanelComponent;
  let fixture: ComponentFixture<TabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
