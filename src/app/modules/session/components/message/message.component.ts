import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Message } from '../../../../services/message/message.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { FadeInAnimation } from '../../../../animations';
import { TippyDirective } from '@ngneat/helipopper';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'message',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    TippyDirective,
    ClipboardModule
  ],
  templateUrl: './message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FadeInAnimation],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit {

  @Input() message: Message | undefined;
  @Input() processing: boolean = false;
  @Input() terminal: boolean = false;
  @Output() onRegenerate: EventEmitter<void> = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private markdownService: MarkdownService) {

  }

  ngOnInit(): void {
    if (this.message && this.message.content) {
      console.log(this.markdownService.parse(this.message.content))
      console.log(this.markdownService.getSource(this.message.content))
    }
  }

  public copied: boolean = false;
  public onCopy(): void {
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  // Replaces the icon & text briefly after the user copies a code snippet
  public handleButtonClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    const buttonId = this.getElementId(element);

    if (!buttonId) return;

    const button = document.getElementById(buttonId);
    if (!button) return;

    const svgIcon = button.querySelector('#svg-icon');
    if (!svgIcon) return;

    svgIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />';

    const text = button.querySelector('#text');
    if (!text) return;

    text.innerHTML = 'Copied';

    setTimeout(() => {
      text.innerHTML = 'Copy Code';
      svgIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white"><path fill-rule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0 1 14.75 19h-9.5A2.25 2.25 0 0 1 3 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 0 1 9 1h2c1.373 0 2.531.923 2.887 2.182ZM7.5 4A1.5 1.5 0 0 1 9 2.5h2A1.5 1.5 0 0 1 12.5 4v.5h-5V4Z" clip-rule="evenodd" />';
      this.cdr.detectChanges();
    }, 1000);
  }

  getElementId(element: HTMLElement): string | null {
    if (element.parentElement?.id && element.parentElement?.id !== 'svg-icon') {
      return element.parentElement?.id;
    }
    if (element.parentElement?.parentElement?.id) {
      return element.parentElement?.parentElement?.id;
    }
    return null;
  }

}
