/**
 * Language options mapping
 */
const languageOptions = {
  'en-us': 'English (US)',
  'en-gb': 'English (GB)',
  'en-au': 'English (AU)',
  'en-ca': 'English (CA)',
  'en-in': 'English (IN)',
  'en-za': 'English (ZA)',
  'es-es': 'Spanish (ES)',
  'es-mx': 'Spanish (MX)',
  'fr-fr': 'French (FR)',
  'fr-ca': 'French (CA)',
  'de-de': 'German (DE)',
  'de-ch': 'German (CH)',
  'it-it': 'Italian (IT)',
  'pt-pt': 'Portuguese (PT)',
  'pt-br': 'Portuguese (BR)',
  'zh-cn': 'Chinese (CN)',
  'zh-tw': 'Chinese (TW)',
  'ja-jp': 'Japanese (JP)'
};

/**
 * Switches the language in the URL and updates the tab accordingly.
 * @param {string} url - The current URL of the tab.
 * @param {string} targetLanguage - The target language code.
 * @param {boolean} openInNewTab - Whether to open the new URL in a new tab.
 */
function switchLanguage(url, targetLanguage, openInNewTab = false) {
  const path = new URL(url).pathname;
  const currentLanguage = Object.keys(languageOptions).find(lang => path.includes(`/${lang}`));

  if (currentLanguage) {
    url = url.replace(`/${currentLanguage}`, `/${targetLanguage}`);
  } else {
    url = url.replace(/\/[^/]+/, `/${targetLanguage}`);
  }

  if (openInNewTab) {
    browser.tabs.create({ url: url });
  } else {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      browser.tabs.update(tabs[0].id, { url: url });
    });
  }
}

/**
 * Handles popup actions sent from popup.js.
 * @param {string} currentUrl - The current URL of the tab.
 * @param {string} targetLanguage - The target language code.
 * @param {boolean} openInNewTab - Whether to open the new URL in a new tab.
 */
function onPopupAction(currentUrl, targetLanguage, openInNewTab) {
  switchLanguage(currentUrl, targetLanguage, openInNewTab);
}

/**
 * Listens for messages from popup.js and performs the corresponding actions.
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'switchLanguage') {
    onPopupAction(message.currentUrl, message.targetLanguage, message.openInNewTab);
  }
});
