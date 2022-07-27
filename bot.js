require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')
const path = require('path')
const Token = process.env.BOT_TOKEN

const bot = new TelegramBot(Token, {
    polling: true
})

bot.on('message', msg => {
    
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'model', 'users.json')))
    const foundUser = users.find(el => el.id == msg.chat.id)
    
    if (!foundUser) {

        users.push({ id: msg.chat.id })
        fs.writeFileSync(path.join(__dirname, 'model', 'users.json'), JSON.stringify(users, null, 4))
    }
})

bot.on('message', msg => {
    const chatId = msg.chat.id
    const message = msg.text

    if (message == '/start') {
        bot.sendMessage(chatId, `Assalomu aleykum ${msg.chat.first_name}`, {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{
                        text: "salom"
                    }]
                ],
                resize_keyboard: true
            })
        })
    }

    if (message == 'salom') {
        bot.sendMessage(chatId, `Assalomu aleykum`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'hi', callback_data: 'hi'}]
                ]
            }
        })
    }
    
})

bot.on('callback_query', msg => {
    const chatId = msg.message.chat.id

    if (msg.data == 'hi') {

        bot.answerCallbackQuery(msg.id, show_alert = 'hello')
        bot.deleteMessage(chatId, msg.message.message_id)
    }

})

bot.on('message', msg => {
    const chatId = msg.chat.id
    const message = msg.text
    if (chatId == 502480594) {
        // console.log(message.split(' ')[1]);
        
        const messages = message.split('-')

        if (messages[0] == '/send') {
            const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'model', 'users.json')))

            users.map(el => {
                bot.sendMessage(el.id, messages[1])
            })
            
        }

        if (message == '/help') {
            bot.sendMessage(chatId, '/send-xabar xabar')
        }

        if (message == '/data') {
            return bot.sendDocument(chatId, path.join(__dirname, 'model', 'users.json'))
        }
    }
})

const time = new Date()

if (time.getHours() == 14 && time.getMinutes() == 10) {
    console.log('ishladi');
    
    return bot.sendDocument(502480594, path.join(__dirname, 'model', 'users.json'))
}
