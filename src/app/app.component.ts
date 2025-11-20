import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createPartFromBase64, createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { environment } from '../environments/environment';

 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="title-container">
      <h1 class="app-title">Chat<span>BOB</span></h1>
    </div>
    <div class="search-container">
      <div class="search-box">
        <div class="search-icon">
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
        <input 
          type="text" 
          class="search-input" 
          [(ngModel)]="searchQuery" 
          (keyup.enter)="onSearch()"
          placeholder="Ask me anything"
          #searchInput
        >
        <div class="upload-icon" (click)="fileInput.click()" role="button" tabindex="0" aria-label="Upload image" (keyup.enter)="fileInput.click()">
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
        </div>
        <input type="file" class="hidden-file-input" accept="image/*" #fileInput (change)="onImageSelected($event)">

      </div>
      <div class="image-preview" *ngIf="selectedBase64String">
        <h3>Image Preview:</h3>
        <img [src]="'data:' + selectedMimeType + ';base64,' + selectedBase64String" alt="Uploaded Image" class="preview-image">
      </div>
      <div class="search-buttons">
        <button (click)="onSearch()">Ask</button>
      </div>

      <!-- Add this new response section -->
      <div *ngIf="aiResponse">
        <h3>AI Response:</h3>
        <p>{{ aiResponse }}</p>
      </div>
    </div>
  `,
  styles: [`
    .title-container {
      text-align: center;
      margin-bottom: 20px;
    }

    .app-title {
      font-size: 4rem;
      font-weight: 800;
      background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 300% 300%;
      animation: gradient 8s ease infinite;
      letter-spacing: -1px;
      margin: 0;
    }

    .app-title span {
      font-weight: 300;
    }

    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .search-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 584px;
      margin: 0 auto;
    }

    .search-box {
      display: flex;
      align-items: center;
      width: 100%;
      height: 44px;
      border: 1px solid #dfe1e5;
      border-radius: 24px;
      padding: 0 14px;
      margin: 24px 0;
      transition: box-shadow 200ms;
    }

    .search-box:hover, .search-box:focus-within {
      box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
      border-color: rgba(223, 225, 229, 0);
    }

    .search-icon {
      width: 20px;
      height: 20px;
      color: #9aa0a6;
      margin-right: 8px;
    }

    .mic-icon {
      width: 24px;
      height: 24px;
      color: #4285f4;
      margin-left: auto;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      background: transparent;
    }

    .search-buttons {
      display: flex;
      gap: 12px;
      margin-top: 0px;
    }

    button {
      background-color: #1a73e8;
      border: 1px solid #1a73e8;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      margin: 11px 4px;
      padding: 0 24px;
      height: 36px;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
      font-weight: 500;
    }

    button:hover {
      background-color: #1557b0;
      border-color: #1557b0;
      box-shadow: 0 1px 2px 0 rgba(66, 133, 244, 0.3), 0 1px 3px 1px rgba(66, 133, 244, 0.15);
    }

    .image-preview {
      margin-top: 16px;
      text-align: center;
    }

    .preview-image {
      max-width: 100%;
      max-height: 300px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AppComponent {
  searchQuery: string = '';
  aiResponse: string = '';

  ai = new GoogleGenAI({apiKey: environment.GEMINI_API_KEY});

  selectedBase64String: string | null = null;
  selectedMimeType: string | null = null;
 

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // Extract MIME type and Base64 content. 
      const [prefix, base64] = result.split(',');
      const mimeMatch = prefix.match(/data:(.*);base64/);

      if (mimeMatch && base64) {
        this.selectedMimeType = mimeMatch[1]; // e.g., image/png
        this.selectedBase64String = base64;   // pure Base64 string
      } else {
        console.error('Invalid Base64 format');
      }

      console.log('Base64 Image:', this.selectedBase64String); //for debugging
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file!); // This converts the file to base64
  }

  async onSearch() {

    //build the content using the image and text query
    const contents = createUserContent([
        createPartFromBase64(this.selectedBase64String!,this.selectedMimeType!),
        this.searchQuery]);

    //call the generate content method
    const result = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: 'You are a helpful assistant only answering questions about bicycles. \
         Keep the responses short and concise. Not more than 4 sentences',
        maxOutputTokens: 4096,
        temperature: 2.0,
      }
    });
    
    this.aiResponse = result.text ?? ''
    console.log(this.aiResponse);
  }
}
