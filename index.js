const TelegramApi = require('node-telegram-bot-api');
const command = require('nodemon/lib/config/command');

const token = '5341358640:AAGzBnlMGrqVtiNCHkDQdFwNZFOptVqPjbQ'


const bot = new TelegramApi(token, {polling: true}) 

var entryPrice;
var commision;
var margin;
const minimumLogisticsThreshold = 1000;
const maximumLogisticsThreshold = 2000;
var logistcs;
const minimumLastMile = 260;
const maximumLastMile = 5200;
var lastMile;

const start = () => {
    bot.setMyCommands ([
        {command: '/start', description: 'Приветствие'},

        {command: '/calculation', description: 'Расчёт цены'},
        {command: '/clear', description: 'Очистить все значения'}
    ])
    
    bot.on('message',  msg => {
        const text = msg.text;
        const chatid = msg.chat.id;

        if (text === '/start') {
             bot.sendSticker (chatid, 'https://tlgrm.ru/_/stickers/43e/041/43e041ad-afbb-34c9-8e62-222f29474c0e/192/19.webp')
         bot.sendMessage (chatid, 'Привет, давай посчитаем тебе цены')
        }
    })

}

start()

bot.onText(/\/calculation/, msg=> {
     const chatid = msg.chat.id


     if (entryPrice === undefined){
         bot.sendMessage(chatid, 'введите цену входа')
     }

     if (commision === undefined){
         bot.sendMessage(chatid, 'введите коммисию' )
     }
     if (margin === undefined){
         bot.sendMessage(chatid, 'введите наценку' )
     }
     if (weigt === undefined) {
         bot.sendMessage(chatid, 'введите вес')
     }
  })
  bot.on('message',  msg =>{
      const chatid = msg.chat.id
      if (msg.text.startsWith('/')){

      }else if (entryPrice === undefined){
          entryPrice = parseInt(msg.text)
           bot.sendMessage(chatid, 'цена входа равна ' + entryPrice)
      } else if (commision === undefined){
          commision = parseInt(msg.text)
           bot.sendMessage(chatid, 'коммиссия равна ' + commision)
      } else if (margin === undefined){
          margin = parseInt(msg.text)
          bot.sendMessage(chatid, 'наценка равна ' + margin) 
      } 
      
      if(margin + entryPrice < minimumLogisticsThreshold){
          logistcs = 50
          bot.sendMessage(chatid, 'логистика равна ' + logistcs)
      }else if (margin + entryPrice > maximumLogisticsThreshold){
          logistcs = 100
          bot.sendMessage(chatid, 'логистика равна ' + logistcs)
      }else if(margin + entryPrice < maximumLogisticsThreshold || margin+entryPrice > minimumLogisticsThreshold){
          logistcs = (margin + entryPrice) * 0.05;
          bot.sendMessage(chatid, 'логистика равна ' + logistcs)
      }

      if (margin+entryPrice+logistcs < minimumLastMile ){
          lastMile = 13;
          bot.sendMessage(chatid, 'последняя миля равна ' + lastMile)
      }else if (margin+entryPrice+logistcs > maximumLastMile){
          lastMile = 260
          bot.sendMessage(chatid, 'последняя миля равна ' + lastMile)
      }else if (margin+entryPrice+logistcs < maximumLastMile || margin+entryPrice+logistcs > minimumLastMile){
          lastMile= (margin+entryPrice+logistcs) * 0.05
          bot.sendMessage(chatid, 'последняя миля равна ' + lastMile)
      }
      
      if(msg.text.startsWith('/')){
          
      } else {
        var calculatedCommission = (margin+entryPrice+logistcs+lastMile) / 100 * commision
        bot.sendMessage(chatid,'коммиссия равна ' + calculatedCommission)
      } 
      
      if (msg.text.startsWith('/')){

      }else {
          var retailPrice = margin + entryPrice + logistcs + lastMile + calculatedCommission
          bot.sendMessage(chatid, 'Братишка, лучше всего продавать по такой цене ' + retailPrice)
      }





      bot.onText(/\/clear/, msg =>{
        entryPrice = undefined
        logistcs = undefined
        margin = undefined
        commision = undefined
      })





  })