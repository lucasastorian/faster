import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSelectionDropdownComponent } from './model-selection-dropdown.component';

describe('ModelSelectionDropdownComponent', () => {
  let component: ModelSelectionDropdownComponent;
  let fixture: ComponentFixture<ModelSelectionDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelSelectionDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelSelectionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
