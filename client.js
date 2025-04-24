import WebSocket from 'ws'
import readline from 'readline'
import chalk from 'chalk' // Убедитесь, что chalk установлен (npm install chalk)

const ws = new WebSocket('ws://217.144.188.167:8080')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// В chalk v5+ нужно использовать так:
console.log(chalk.yellow('Сообщение')) // вместо chalk.yellow('Сообщение')
// Цвета для сообщений
const colors = {
	server: chalk.red,
	client: chalk.green,
	me: chalk.blue,
	system: chalk.yellow,
}

ws.on('message', (message) => {
	console.log(colors.server(message.toString()))
})

ws.on('open', () => {
	console.log(colors.system('✅ Подключено к серверу. Введите сообщение:'))

	rl.on('line', (input) => {
		if (input.trim() === 'exit') {
			ws.close()
			rl.close()
			return
		}

		if (ws.readyState === WebSocket.OPEN) {
			ws.send(`Клиент: ${input}`)
			console.log(colors.me(`Вы: ${input}`))
		}
	})
})

ws.on('error', (error) => {
	console.error(colors.system(`❌ Ошибка подключения: ${error.message}`))
})

ws.on('close', () => {
	console.log(colors.system('🔌 Соединение закрыто'))
	rl.close()
})
