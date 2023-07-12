/**
 * get language from text
 * @param text
 * @returns language
 * @example
 * ```
 * getLang('hello world') // en-US
 * getLang('你好世界') // zh-CN
 * ```
 **/
export function getLang(text: string) {
  let lang = '';
  const chineseReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
  const englishReg = /[a-zA-Z]/;

  const chineseCount = (text.match(chineseReg) || []).length || 0;
  const englishCount = (text.match(englishReg) || []).length || 0;

  if (chineseCount > englishCount) {
    if (chineseCount / text.length > 0.5) {
      lang = 'zh-CN';
    }
  } else {
    if (englishCount / text.length > 0.5) {
      lang = 'en-US';
    }
  }

  console.log('--getLang--', text, lang);

  return lang;
}

export function extractLangAndClean(text: string): {
  lang: string;
  text: string;
} {
  const regex = /^<lang>(.*?)<\/lang>/;
  const match = regex.exec(text);

  if (match) {
    return {
      lang: match[1],
      text: text.replace(regex, ''),
    };
  }

  return {
    lang: '',
    text,
  };
}
