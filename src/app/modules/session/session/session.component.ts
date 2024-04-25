import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { PromptEditorComponent } from '../components/prompt-editor/prompt-editor.component';
import { PromptSuggestionsComponent } from '../components/prompt-suggestions/prompt-suggestions.component';
import { MessageComponent } from '../components/message/message.component';
import { ModelSelectionDropdownComponent } from '../components/model-selection-dropdown/model-selection-dropdown.component';
import { Subject } from 'rxjs';
import { Message, MessageService } from '../../../services/message/message.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    CommonModule,
    TippyDirective,
    PromptEditorComponent,
    PromptSuggestionsComponent,
    MessageComponent,
    ModelSelectionDropdownComponent
  ],
  templateUrl: './session.component.html',
})
export class SessionComponent {

  @ViewChild(PromptEditorComponent) public promptEditor: PromptEditorComponent | undefined;
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined

  public destroyed$: Subject<void> = new Subject<void>();

  public processing: boolean = false;

  public model: 'llama3-7b-8192' | 'llama3-70b-8192' = 'llama3-70b-8192';
  public messages: Message[] = [];

  public firstTokenArrived: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private messageService: MessageService) {

  }

  ngAfterViewInit(): void {
    this.focus();
  }

  public focus(): void {
    this.promptEditor?.focus();
  }


  public newSession(): void {
    this.messages = [];
  }

  public stream(prompt: string): void {
    this.processing = true;
    this.firstTokenArrived = false;

    const message: Message = {
      id: uuidv4(),
      date: this.messageService.getCurrentUtcTimestamp(),
      role: 'User',
      status: 'Completed',
      content: prompt,
      created_at: this.messageService.getCurrentUtcTimestamp(),
      updated_at: this.messageService.getCurrentUtcTimestamp()
    }

    this.messages.push(message);
    this.cdr.detectChanges();
    this.scrollToBottom();
    console.log(this.messages);

    this.messageService.stream(this.messages, this.model).subscribe({
      next: (message: Message) => {
        console.log(message);
        if (!this.firstTokenArrived) {
          this.scrollToBottom();
        }
        this.firstTokenArrived = true;

        this._updateMessages(message);

        this.scrollToBottom();

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log("Failed to stream messages", error);
        this.processing = false;
        this.messages = [];

        this.cdr.detectChanges();
      },

      complete: () => {
        console.log("Completed streaming messages");
        this.processing = false;
        this.focus();
        console.log(this.messages);
        this.cdr.detectChanges();
      }
    })
  }

  isUserAtBottom(): boolean {
    if (!this.scrollContainer) {
      return false;
    }
    const nativeElement = this.scrollContainer.nativeElement;
    return (nativeElement.scrollTop + nativeElement.clientHeight + 1 >= nativeElement.scrollHeight);
  }

  scrollToBottom(): void {
    if (!this.scrollContainer) {
      return;
    }

    try {
      const element = this.scrollContainer.nativeElement;
      const scrollOptions: ScrollToOptions = {
        top: element.scrollHeight,
        left: 0,
        behavior: 'smooth'
      };

      element.scrollTo(scrollOptions);
    } catch (err) {
      console.error('Could not scroll to bottom: ', err);
    }
  }


  private _updateMessages(message: Message): void {
    const messageIndex = this.messages.findIndex(m => m.id === message?.id);
    if (messageIndex !== -1) {
      // this.messages[messageIndex]['content'] = message.content;
      this.messages[messageIndex] = message;
    } else {
      this.messages.push(message!);
    }
  }

  trackMessage(index: number, message: Message): string {
    return message.id.toString();
  }

}
