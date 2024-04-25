import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Groq } from 'groq-sdk';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string
  date: string;
  content?: string | null;
  role: 'Assistant' | 'User' | 'Tool';
  status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
  created_at: string;
  updated_at: string;
};

export type GroqMessage = {
  role: 'assistant' | 'user';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public temperature: number = 0.254;
  public groq: Groq = new Groq({
    apiKey: environment.groq_api_key,
    dangerouslyAllowBrowser: true
  });

  constructor() { }

  public stream(messages: Array<Message>, model: 'llama3-8b-8192' | 'llama3-70b-8192'): Observable<Message> {
    const message: Message = {
      id: uuidv4(),
      date: this.getCurrentUtcTimestamp(),
      role: 'Assistant',
      content: '',
      status: 'InProgress',
      created_at: this.getCurrentUtcTimestamp(),
      updated_at: this.getCurrentUtcTimestamp()
    }

    from(this.groq.chat.completions.create({ messages: this._formatMessages(messages), model: model, temperature: this.temperature, stream: true })).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    });

    return new Observable<Message>(subscriber => {
      this.groq.chat.completions.create({
        messages: this._formatMessages(messages),
        model: model,
        temperature: this.temperature,
        max_tokens: 1024,
        top_p: 1,
        stop: null,
        stream: true,
      }).then(async completion => {

        for await (const chunk of completion) {
          const delta = chunk.choices[0].delta.content
          if (delta) {
            message.content += delta;
            message.updated_at = this.getCurrentUtcTimestamp();
            subscriber.next({ ...message });
          }
        }
      }).catch((err) => {
        subscriber.error(err)
      }).finally(() => {
        message.status = 'Completed';
        subscriber.next(message);
        subscriber.complete();
      })
    });
  }

  private _formatMessages(messages: Array<Message>): Array<GroqMessage> {
    return messages.map((message: Message) => {
      return {
        role: message.role === 'User' ? 'user' : 'assistant',
        content: message.content || ''
      }
    });
  }

  public getCurrentUtcTimestamp(): string {
    return DateTime.local().toUTC().toISO(); // Get current UTC time in ISO format with timezone
  }
}
