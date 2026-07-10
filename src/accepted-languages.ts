export async function getAcceptedTwoLetterLanguages(): Promise<string[]> {
  const acceptedLanguages = await chrome.i18n.getAcceptLanguages();
  const languages = new Set<string>(['en']);

  for (const acceptedLanguage of acceptedLanguages) {
    const languageCode = acceptedLanguage.trim().toLowerCase().split(/[-_]/)[0];
    if (/^[a-z]{2}$/.test(languageCode)) {
      languages.add(languageCode);
    }
  }

  return [...languages];
}
