import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSuggestionsComponent } from './prompt-suggestions.component';

describe('PromptSuggestionsComponent', () => {
  let component: PromptSuggestionsComponent;
  let fixture: ComponentFixture<PromptSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptSuggestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
