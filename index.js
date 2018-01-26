"use strict";
const Alexa = require('alexa-sdk');
const askNameMsg = '名前を教えてください';
const shareTheWorldMsg = [ 
  'わしが王の中の王<break time="0.1s"/>竜王だ。<break time="0.5s"/>',
  'わし は 待っておった。そなたのような若者が現れることを。<break time="0.5s"/>',
  'もし、わしの味方になれば世界の半分をお前にやろう。<break time="0.5s"/>',
  'どうじゃ？わしの味方になるか？'
].join();
const combatMsg = [
  'では、どうしてもこのわしを倒すというのだな！<break time="0.5s"/>',
  '愚か者め！<break time="0.3s"/>思い知るがよい！'
].join();
const confirmMsg = '本当だな？';
const badEndMsg = [
  'では世界の半分、闇の世界を与えよう！<break time="0.5s"/>',
  'そなたに復活の呪文を教えよう！<break time="0.5s"/>',
  'これを書き留めておくのだぞ。<break time="0.5s"/>',
  'おまえの旅は終わった。<break time="0.5s"/>',
  'さあゆっくり休むがよい！<break time="0.5s"/><say-as interpret-as="interjection">わっはっは</say-as>'
].join();

// ステートの定義
const states = {
  DIALOGUEMODE: '_DIALOGUEMODE',
  FINALQUESTIONMODE: '_FINALQUESTIONMODE'
};

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  // alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(handlers, dialogueHandlers,finalquestionHandlers); // 既存のハンドラに加えてステートハンドラ(後半で定義)も登録
  alexa.execute();
};
var handlers = {
  'LaunchRequest': function () {
    this.emit(':ask',askNameMsg);
  },
  'ShareTheWorldIntent': function () {
    var firstName = this.event.request.intent.slots.firstName.value;
    this.handler.state = states.DIALOGUEMODE; // ステートをセット
    this.attributes['firstName'] = firstName; // 名前をセッションアトリビュートにセット
    var message = 'よく来た' + firstName + 'よ。' + shareTheWorldMsg;
    this.emit(':ask', message); 
    console.log(message);
  }
};
// ステートハンドラの定義
var dialogueHandlers = Alexa.CreateStateHandler(states.DIALOGUEMODE, {
  'AMAZON.NoIntent':function() {
    this.handler.state = '';
    this.attributes['STATE'] = undefined;
    this.emit(':tell', combatMsg);
  },
  'AMAZON.YesIntent':function() {
    this.handler.state = states.FINALQUESTIONMODE; // ステートをセット
    this.emit(':ask', confirmMsg);
  },
  'Unhandled': function() {
    var reprompt = 'どうじゃ？わしの味方になるか？';
    this.emit(':ask', reprompt, reprompt);
}
});
var finalquestionHandlers = Alexa.CreateStateHandler(states.FINALQUESTIONMODE, {
  'AMAZON.NoIntent':function() {
    this.handler.state = '';
    this.attributes['STATE'] = undefined;
    this.emit(':tell', combatMsg);
  },
  'AMAZON.YesIntent':function() {
    this.handler.state = '';
    this.attributes['STATE'] = undefined;
    this.handler.state = states.FINALQUESTIONMODE; // ステートをセット
    this.emit(':tell', badEndMsg);
  },
  'Unhandled': function() {
    var reprompt = 'どうじゃ？わしの味方になるか？';
    this.emit(':ask', reprompt, reprompt);
}
});
