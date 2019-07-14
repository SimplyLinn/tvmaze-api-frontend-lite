export class SearchCancelledError extends Error {
  constructor() {
    super('The search was cancelled.');
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('The resource was not found.');
    this.name = this.constructor.name;
  }
}

export function sleep(ms) {
  return new Promise((res)=>setTimeout(res,ms));
}

export function getCurTime() {
  return (new Date).getTime();
}

export function getAllWords(text) {
  /// <param name="text" type="String"></param>
  const wordSet = new Set();
  text.toLowerCase().split(' ').forEach(w=>w&&wordSet.add(w));
  return [...wordSet];
}

export async function asyncMap(arr, func, entriesPerStep, cancelObj) {
  entriesPerStep = entriesPerStep || 20;
  const newArr = [];
  for(let i = 0; i < arr.length; i++) {
    if(i !== 0 && i % entriesPerStep === 0) {
      await sleep(1);
      if(cancelObj.isCancelled) throw new SearchCancelledError();
    }
    newArr.push(func(arr[i], i, arr));
  }
  return newArr;
}

export function convertHtmlToText(inputText) {
  let returnText = "" + inputText;

  //-- remove BR tags and replace them with line break
  returnText=returnText.replace(/<br>/gi, "\n");
  returnText=returnText.replace(/<br\s\/>/gi, "\n");
  returnText=returnText.replace(/<br\/>/gi, "\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText=returnText.replace(/<p.*?>/gi, "\n");
  returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g,'');

  //-- get rid of html-encoded characters:
  returnText=returnText.replace(/&nbsp;/gi," ");
  returnText=returnText.replace(/&amp;/gi,"&");
  returnText=returnText.replace(/&quot;/gi,'"');
  returnText=returnText.replace(/&lt;/gi,'<');
  returnText=returnText.replace(/&gt;/gi,'>');
  //-- return
  return returnText;
}