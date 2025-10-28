import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
      </div>
      <div class="search-buttons">
        <button (click)="onSearch()">Ask</button>
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
  `]
})
export class AppComponent {
  searchQuery: string = '';

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Add your search logic here
    }
  }
}
