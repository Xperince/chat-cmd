const WebSocket = require('ws')
const readline = require('readline')

const wss = new WebSocket.Server({ port: 8080 })

const clients = new Set()

console.log('WebSocket сервер запущен на ws://localhost:8080')

wss.on('connection', (ws) => {
	console.log('Новое подключение')
	clients.add(ws)

	function broadcast(message, sender) {
		clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		})
	}

	ws.on('message', (message) => {
		console.log(`Получено: ${message}`)
		broadcast(message, ws)
	})

	ws.on('close', () => {
		console.log('Клиент отключился')
		clients.delete(ws)
	})
})

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.on('line', (input) => {
	if (input.trim() === 'exit') {
		wss.close()
		rl.close()
		return
	}

	const message = `Сервер: ${input}`
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message)
		}
	})
	console.log(`Вы (сервер): ${input}`)
})
