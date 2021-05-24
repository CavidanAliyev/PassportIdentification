import Dictionary from './Dictionary';

export const getCharDigit = (char) => {
    if (char ===' ') {
        return 0;
      }
      if(isNaN(parseInt(char))){
        return  char.charCodeAt(0)-55;
      }
      return parseInt(char);
}

let currentLang = 'az';
const supportedLanguages = ['az', 'en', 'ru'];

export const verifyLanguage = (lang = '') => {
    if (!supportedLanguages.find(x => x === lang.toLowerCase()))
        throw new Error(`the language:${lang} is not supported.`);
}

export const use = (lang = '') => {
    verifyLanguage(lang);
    lang = lang.toLowerCase();
    currentLang = lang;
}

export const getCurrentLang = () => {
    return currentLang;
}

export const translate = (key) => {
    let translation = key;

    if (Dictionary[key] && Dictionary[key][currentLang]) {

        translation = Dictionary[key][currentLang];
    }

    return translation;
}
