const WebSocket = require('ws')
const readline = require('readline')

// Создаем WebSocket сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 })

// Коллекция подключенных клиентов
const clients = new Set()

console.log('WebSocket сервер запущен на ws://localhost:8080')

wss.on('connection', (ws) => {
	console.log('Новое подключение')
	clients.add(ws)

	// Отправляем сообщение всем клиентам, кроме отправителя
	function broadcast(message, sender) {
		clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		})
	}

	// Обработка сообщений от клиента
	ws.on('message', (message) => {
		console.log(`Получено: ${message}`)
		broadcast(message, ws)
	})

	// Обработка закрытия соединения
	ws.on('close', () => {
		console.log('Клиент отключился')
		clients.delete(ws)
	})
})

// Интерфейс для ввода сообщений с сервера
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

	// Отправляем сообщение от сервера всем клиентам
	const message = `Сервер: ${input}`
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message)
		}
	})
	console.log(`Вы (сервер): ${input}`)
})
