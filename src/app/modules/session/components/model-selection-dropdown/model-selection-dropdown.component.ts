import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'model-selection-dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './model-selection-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelSelectionDropdownComponent {

  public dropdownOpen: boolean = false;
  @Input() model: 'llama3-7b-8192' | 'llama3-70b-8192' = 'llama3-7b-8192';
  @Output() modelChange: EventEmitter<'llama3-7b-8192' | 'llama3-70b-8192'> = new EventEmitter<'llama3-7b-8192' | 'llama3-70b-8192'>();

  constructor(private cdr: ChangeDetectorRef) {

  }

  public close(): void {
    setTimeout(() => {
      this.dropdownOpen = false;
      this.cdr.detectChanges();
    }, 100);
  }
}
