// language-switcher.js
document.addEventListener('DOMContentLoaded', function() {
    // Get browser language (fallback)
    function getBrowserLanguage() {
        const browserLang = (navigator.language || navigator.userLanguage).substring(0, 2);
        // Only return supported languages
        if (['en', 'ja', 'ko', 'zh'].includes(browserLang)) {
            return browserLang;
        }
        return 'en'; // Default fallback
    }

    // Detect if this is the user's first visit
    if (!localStorage.getItem('walnutLanguagePreference')) {
        // First time visit - redirect based on browser language if not already on that page
        const browserLang = getBrowserLanguage();
        const currentPath = window.location.pathname;
        
        // Check if we need to redirect
        if (browserLang === 'en' && !currentPath.endsWith('index.html') && !currentPath.endsWith('/')) {
            window.location.href = 'index.html';
        } else if (browserLang === 'ja' && !currentPath.includes('japanese.html')) {
            window.location.href = 'japanese.html';
        } else if (browserLang === 'ko' && !currentPath.includes('korean.html')) {
            window.location.href = 'korean.html';
        } else if (browserLang === "zh" && !currentPath.includes('chinese.html')) {
            window.location.href = 'chinese.html'
        }
        
        // Save this preference
        localStorage.setItem('walnutLanguagePreference', browserLang);
    }

    // Handle language selection clicks
    const languageLinks = document.querySelectorAll('.language-selector a');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Store the selected language preference
            const langCode = this.textContent.toLowerCase();
            localStorage.setItem('walnutLanguagePreference', langCode);
        });
    });

    const langDropdown = document.querySelector('.language-dropdown');
    const langBtn = document.querySelector('.language-btn');
    
    if (langBtn) {
      langBtn.addEventListener('click', function(e) {
        e.preventDefault();
        langDropdown.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target)) {
          langDropdown.classList.remove('active');
        }
      });
    }
    
    // Update current language display based on page
    const currentPath = window.location.pathname;
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (currentLangSpan) {
      if (currentPath.includes('japanese.html')) {
        currentLangSpan.textContent = 'JA';
      } else if (currentPath.includes('korean.html')) {
        currentLangSpan.textContent = 'KO';
      } else if (currentPath.includes('chinese.html')) {
        currentLangSpan.textContent = 'CH';
      } else {
        currentLangSpan.textContent = 'EN';
      }
    }
});