// language-switcher.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Language switcher initialized");
    
    // Get browser language (fallback)
    function getBrowserLanguage() {
        const browserLang = (navigator.language || navigator.userLanguage).substring(0, 2);
        // Only return supported languages
        if (['en', 'ja', 'ko', 'zh'].includes(browserLang)) {
            return browserLang;
        }
        return 'en'; // Default fallback
    }

    // Make English the default if no preference is stored
    if (!localStorage.getItem('walnutLanguagePreference')) {
        localStorage.setItem('walnutLanguagePreference', 'en');
    }

    // Handle language dropdown functionality - this is the critical part
    const languageBtn = document.querySelector('.language-btn');
    const languageOptions = document.querySelector('.language-options');
    
    if (languageBtn && languageOptions) {
        console.log("Language dropdown elements found");
        
        // Toggle dropdown when clicking the language button
        languageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageOptions.classList.toggle('active');
            console.log("Language dropdown toggled");
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (languageOptions.classList.contains('active')) {
                languageOptions.classList.remove('active');
                console.log("Language dropdown closed by outside click");
            }
        });
        
        // Prevent clicks inside dropdown from closing it
        languageOptions.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.warn("Language dropdown elements not found");
    }

    // Handle language selection
    const languageLinks = document.querySelectorAll('.lang-option');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Store the selected language preference based on the link href
            const href = this.getAttribute('href');
            console.log("Language selection clicked: " + href);
            
            if (href.includes('japanese')) {
                localStorage.setItem('walnutLanguagePreference', 'ja');
            } else if (href.includes('korean')) {
                localStorage.setItem('walnutLanguagePreference', 'ko');
            } else if (href.includes('chinese')) {
                localStorage.setItem('walnutLanguagePreference', 'zh');
            } else {
                localStorage.setItem('walnutLanguagePreference', 'en');
            }
        });
    });
    
    // Ensure the correct language code is displayed
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('japanese.html')) {
            currentLangSpan.textContent = 'JA';
        } else if (currentPath.includes('korean.html')) {
            currentLangSpan.textContent = 'KO';
        } else if (currentPath.includes('chinese.html')) {
            currentLangSpan.textContent = 'ZH';
        } else {
            currentLangSpan.textContent = 'EN';
        }
        console.log("Current language set to: " + currentLangSpan.textContent);
    }
});