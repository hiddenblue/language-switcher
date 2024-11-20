document.addEventListener('DOMContentLoaded', () => {
  /**
   * Theme radio buttons
   */
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  const lightThemeRadio = document.querySelector('input[value="light"]');
  const darkThemeRadio = document.querySelector('input[value="dark"]');
  const body = document.body;

  /**
   * Language select elements
   */
  const languageSelect1 = document.getElementById('languageSelect1');
  const languageSelect2 = document.getElementById('languageSelect2');

  /**
   * Switch buttons
   */
  const switchCurrent1Button = document.getElementById('switchCurrent1');
  const switchNewTab1Button = document.getElementById('switchNewTab1');
  const switchCurrent2Button = document.getElementById('switchCurrent2');
  const switchNewTab2Button = document.getElementById('switchNewTab2');

  /**
   * Load saved theme from storage
   */
  browser.storage.local.get('theme').then(result => {
    const savedTheme = result.theme || 'light';
    if (savedTheme === 'dark') {
      darkThemeRadio.checked = true;
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } else {
      lightThemeRadio.checked = true;
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  });

  /**
   * Theme change event listener
   */
  themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        browser.storage.local.set({ theme: 'dark' });
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        browser.storage.local.set({ theme: 'light' });
      }
    });
  });

  /**
   * Load saved language selections from storage
   */
  browser.storage.local.get(['language1', 'language2']).then(result => {
    const savedLanguage1 = result.language1 || 'en-us';
    const savedLanguage2 = result.language2 || 'zh-cn';
    languageSelect1.value = savedLanguage1;
    languageSelect2.value = savedLanguage2;
  });

  /**
   * Switch Current Tab for Language 1
   */
  switchCurrent1Button.addEventListener('click', () => {
    const targetLanguage = languageSelect1.value;
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const currentUrl = tabs[0].url;
      browser.runtime.sendMessage({ action: 'switchLanguage', currentUrl: currentUrl, targetLanguage: targetLanguage, openInNewTab: false });
      browser.storage.local.set({ language1: targetLanguage });
    });
  });

  /**
   * Open in New Tab for Language 1
   */
  switchNewTab1Button.addEventListener('click', () => {
    const targetLanguage = languageSelect1.value;
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const currentUrl = tabs[0].url;
      browser.runtime.sendMessage({ action: 'switchLanguage', currentUrl: currentUrl, targetLanguage: targetLanguage, openInNewTab: true });
      browser.storage.local.set({ language1: targetLanguage });
    });
  });

  /**
   * Switch Current Tab for Language 2
   */
  switchCurrent2Button.addEventListener('click', () => {
    const targetLanguage = languageSelect2.value;
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const currentUrl = tabs[0].url;
      browser.runtime.sendMessage({ action: 'switchLanguage', currentUrl: currentUrl, targetLanguage: targetLanguage, openInNewTab: false });
      browser.storage.local.set({ language2: targetLanguage });
    });
  });

  /**
   * Open in New Tab for Language 2
   */
  switchNewTab2Button.addEventListener('click', () => {
    const targetLanguage = languageSelect2.value;
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const currentUrl = tabs[0].url;
      browser.runtime.sendMessage({ action: 'switchLanguage', currentUrl: currentUrl, targetLanguage: targetLanguage, openInNewTab: true });
      browser.storage.local.set({ language2: targetLanguage });
    });
  });

  /**
   * Initializes the language select dropdown with the current language from the URL.
   */
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const currentUrl = tabs[0].url;
    const path = new URL(currentUrl).pathname;
    const currentLanguageFromUrl = Object.keys(languageOptions).find(lang => path.includes(`/${lang}`)) || 'en-us';

    // Set default language selections if not saved
    browser.storage.local.get(['language1', 'language2']).then(result => {
      const savedLanguage1 = result.language1 || currentLanguageFromUrl;
      const savedLanguage2 = result.language2 || 'en-us';
      languageSelect1.value = savedLanguage1;
      languageSelect2.value = savedLanguage2;
    });
  });
});
