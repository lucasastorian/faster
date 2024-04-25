import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'prompt-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './prompt-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptEditorComponent {

  @ViewChild('textInput') promptInput: ElementRef<HTMLInputElement> | undefined;

  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'Type something...'
  @Input() completionInProgress: boolean = false;
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();

  public numRows: number = 1;
  promptControl = new FormControl('', [Validators.required]);

  constructor(private cdr: ChangeDetectorRef) {

  }

  // Update the prompt control when the disabled input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.promptControl.disable();
      } else {
        this.promptControl.enable();
      }
    }
  }

  // Focus the prompt input field
  public focus(): void {
    if (this.promptInput) {
      console.log("Focus")
      this.promptInput.nativeElement.focus();
    }
  }

  // Click enter to submit the prompt
  @HostListener("document:keydown", ["$event"]) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey && !this.disabled && this.promptControl.value !== "") {
      event.preventDefault(); // Prevent default action to handle the event here (especially useful to avoid form submission)
      const prompt = this.promptControl.value!.trim();
      this.onSubmit.emit(prompt);
      this.promptControl.reset();
      this.cdr.detectChanges();
      this.adjustTextArea();
    }
  }

  @HostListener('input', ['$event.target'])
  adjustTextArea() {
    const textarea = this.promptInput?.nativeElement;
    if (!textarea) { return }
    textarea.style.height = 'auto'; // Reset the height allows the textarea to shrink when deleting text
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px'; // Set the textarea height based on the scroll height, capped at 400px
  }

}
