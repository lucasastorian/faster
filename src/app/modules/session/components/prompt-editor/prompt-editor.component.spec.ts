import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptEditorComponent } from './prompt-editor.component';

describe('PromptEditorComponent', () => {
  let component: PromptEditorComponent;
  let fixture: ComponentFixture<PromptEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
