import { ApplicationConfig, Injector, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer, provideMarkdown } from 'ngx-markdown';
import { provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { DomSanitizer } from '@angular/platform-browser';

function markedOptionsFactory(injector: Injector): MarkedOptions {
  const sanitizer: DomSanitizer = injector.get(DomSanitizer);
  const renderer = new MarkedRenderer();

  // Override the list renderer to add Tailwind classes for bullet points and spacing
  renderer.list = (body: string, ordered: boolean) => {
    const type = ordered ? 'ol' : 'ul';
    const listClass = ordered ? 'pl-4' : 'pl-4';
    const style = ordered ? 'list-style-type: decimal; margin-bottom: 16px;' : 'list-style-type: disc; margin-bottom: 16px;';
    return `<${type} class="${listClass} mt-4 mb-4" style="${style}">${body}</${type}>`;
  };

  renderer.listitem = (text: string) => {
    return `<li class="mt-2 mb-2">${text}</li>`;
  }

  renderer.paragraph = (text: string) => {
    return `<p style="margin-bottom: 16px;">${text}</p>`;
  };

  renderer.heading = (text: string, level: number) => {
    const fontSizeMap: { [key: number]: string } = {
      1: '28px', // example size for h1
      2: '24px', // example size for h2
      3: '20px', // example size for h3
      4: '16px', // example size for h4
      5: '14px', // example size for h5
      6: '12px'  // example size for h6
    };

    const fontSize = fontSizeMap[level] || '16px';

    return `<h${level} style="font-size: ${fontSize}; margin-bottom: 16px;">${text}</h${level}>`;
  }

  renderer.table = (header: string, body: string) => {
    return `<table class="rounded-md" style="box-shadow: 0 0 0 1px white; margin: 25px 25px; border-collapse: seperate">${header}${body}</table>`
  }

  renderer.tablerow = (content: string) => {
    // Add a bottom border to each row for separation
    return `<tr style="border-bottom: 1px solid white">${content}</tr>`;
  }

  renderer.tablecell = (content: string, flags: { header: boolean, align: 'center' | 'left' | 'right' | null }) => {
    // Increase padding for readability and style header cells
    let cellStyle = `padding: 12px 15px; text-align: ${flags.align || 'left'};`;
    if (flags.header) {
      // Header-specific styles
      cellStyle += 'background-color: rgb(30 41 59);; font-weight: bold;';
      return `<th style="${cellStyle} font-size: 14px">${content}</th>`;
    } else {
      // Zebra striping for non-header cells
      cellStyle += 'background-color: rgb(17 24 39);';
      return `<td style="${cellStyle} font-size: 14px">${content}</td>`;
    }
  }

  renderer.code = (code: string, infostring: string | undefined, isEscaped: boolean) => {
    const id = Math.random().toString(36).substring(7);
    const encodedCode = encodeURIComponent(code);
    const escapedCode = escape(code);
    return `
    <script>
    function test() {
      console.log('testing');
    }
  </script>
    <div class="bg-slate-800 rounded-md w-full">
  <header class="h-8 flex items-center justify-between px-4 bg-slate-700 rounded-t-md">
    <span class="text-white text-xs">${infostring || 'Code'}</span>
    <button class="flex justify-start items-center space-x-2 text-white" onclick=navigator.clipboard.writeText(decodeURIComponent("${encodedCode}")) onclick=test() id=${id}>
    <svg id="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-white">
      <path fill-rule="evenodd" d="M10.986 3H12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.014A2.25 2.25 0 0 1 7.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM9.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clip-rule="evenodd" />
    </svg>
    <span class="text-xs" id="text">Copy Code</span>
  </button>

  </header>
      <pre class="text-white text-sm p-4 overflow-x-auto mt-0 rounded-b-md"><code>${escapedCode}</code></pre>
    </div>
   
    `;
  }

  return {
    renderer,
    gfm: true,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
        deps: [Injector],
      },
    }),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    })]
};
