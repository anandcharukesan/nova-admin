/**
 * Nova Admin - Frontend Interaction Controller
 * Built with vanilla JS, integrates with Alpine.js and Chart.js.
 */

// Initialize and manage Theme (Light / Dark)
const NovaTheme = {
  init() {
    const savedTheme = localStorage.getItem('nova_admin_theme') || 'auto';
    this.setTheme(savedTheme);

    // Listen to OS system preference changes if 'auto'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('nova_admin_theme') === 'auto') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  setTheme(theme) {
    localStorage.setItem('nova_admin_theme', theme);
    if (theme === 'auto') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(isSystemDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  },

  applyTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Dispatch event for other listeners (like custom charts)
    window.dispatchEvent(new CustomEvent('nova-theme-changed', { detail: { theme: mode } }));
  },

  toggle() {
    const current = localStorage.getItem('nova_admin_theme') || 'auto';
    let next = 'light';
    if (current === 'light') next = 'dark';
    else if (current === 'dark') next = 'auto';
    
    this.setTheme(next);
    return next;
  }
};

// Command Palette Keyboard Listener
document.addEventListener('keydown', (e) => {
  // Check for Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  }
  // Check for Escape to close elements
  if (e.key === 'Escape') {
    window.dispatchEvent(new CustomEvent('close-all-overlays'));
  }
});

// Image Preview Helper for Django Admin Files
const NovaFilePreview = {
  bind(inputElement, previewContainerId) {
    if (!inputElement) return;
    
    inputElement.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const previewContainer = document.getElementById(previewContainerId);
      if (!file || !previewContainer) return;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewContainer.innerHTML = `
            <div class="relative mt-2 inline-block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src="${event.target.result}" class="max-h-40 w-auto object-cover" />
              <button type="button" class="absolute top-1 right-1 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors" 
                onclick="this.parentElement.remove(); document.getElementById('${inputElement.id}').value='';" title="Clear selection">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-1">${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
          `;
        };
        reader.readAsDataURL(file);
      } else {
        // Simple file text fallback
        previewContainer.innerHTML = `
          <div class="flex items-center gap-2 p-3 mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <div>
              <p class="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">${file.name}</p>
              <p class="text-xxs text-slate-400">${(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        `;
      }
    });
  }
};

// Export to window
window.NovaTheme = NovaTheme;
window.NovaFilePreview = NovaFilePreview;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  NovaTheme.init();
});
