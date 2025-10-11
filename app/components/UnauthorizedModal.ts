'use client';

import { clearAllAuthData } from '../utils/authToken';

interface UnauthorizedModalProps {
  onClose?: () => void;
}

export class UnauthorizedModalManager {
  private static instance: UnauthorizedModalManager | null = null;
  private modalElement: HTMLElement | null = null;

  static getInstance(): UnauthorizedModalManager {
    if (!UnauthorizedModalManager.instance) {
      UnauthorizedModalManager.instance = new UnauthorizedModalManager();
    }
    return UnauthorizedModalManager.instance;
  }

  show(onClose?: () => void): void {
    if (typeof window === 'undefined' || this.modalElement) {
      return; // Already showing or not in browser
    }

    // Create modal HTML
    const modalHTML = `
      <div id="unauthorized-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: system-ui, -apple-system, sans-serif;
        animation: fadeIn 0.2s ease-out;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: slideIn 0.3s ease-out;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background-color: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem auto;
          ">
            <svg width="24" height="24" fill="#dc2626" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 style="
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
            margin-top: 0;
          ">Session Expired</h3>
          <p style="
            color: #6b7280;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            line-height: 1.4;
            margin-top: 0;
          ">Your session has expired. Please log in again to continue.</p>
          <button id="unauthorized-ok-btn" style="
            background-color: #dc2626;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s ease;
          ">OK</button>
        </div>
        
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              transform: translateY(-20px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          #unauthorized-ok-btn:hover {
            background-color: #b91c1c !important;
          }
          
          #unauthorized-ok-btn:active {
            transform: translateY(1px);
          }
        </style>
      </div>
    `;

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modalElement = document.getElementById('unauthorized-modal');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Handle OK button click
    const okButton = document.getElementById('unauthorized-ok-btn');
    if (okButton) {
      okButton.onclick = () => {
        this.hide();
        this.performLogout();
        if (onClose) {
          onClose();
        }
      };
    }

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.hide();
        this.performLogout();
        if (onClose) {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Store escape handler for cleanup
    if (this.modalElement) {
      (this.modalElement as any)._escapeHandler = handleEscape;
    }
  }

  hide(): void {
    if (this.modalElement) {
      // Remove escape key listener
      const escapeHandler = (this.modalElement as any)._escapeHandler;
      if (escapeHandler) {
        document.removeEventListener('keydown', escapeHandler);
      }

      // Restore body scroll
      document.body.style.overflow = '';

      // Remove modal with fade out animation
      this.modalElement.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        if (this.modalElement) {
          this.modalElement.remove();
          this.modalElement = null;
        }
      }, 200);
    }
  }

  private performLogout(): void {
    try {
      // Clear auth data
      clearAllAuthData();
      
      // Dispatch reset action if Redux store is available
      if (typeof window !== 'undefined' && (window as any).__REDUX_STORE__) {
        (window as any).__REDUX_STORE__.dispatch({ type: "RESET_APP" });
      }

      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback redirect
      window.location.href = '/login';
    }
  }

  // Check if modal is currently showing
  isShowing(): boolean {
    return this.modalElement !== null;
  }
}

// Export convenience functions
export const showUnauthorizedModal = (onClose?: () => void) => {
  UnauthorizedModalManager.getInstance().show(onClose);
};

export const hideUnauthorizedModal = () => {
  UnauthorizedModalManager.getInstance().hide();
};

// Add fadeOut animation style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}