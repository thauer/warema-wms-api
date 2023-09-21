const mqtt = require('mqtt')

const url = 'ws://localhost:1884'
const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: 'farkasehes',
    username: 'mqttuser',
    password: 'mqttpass',
}

const client  = mqtt.connect(url, options)

client.on('connect', () => {
  console.log('Connected')
  client.subscribe('fark', function (err) {
    if (!err) {
      setTimeout( () => { client.publish('fark', 'Hello mqtt  50') }, 50);
      setTimeout( () => { client.publish('fark', 'Hello mqtt 100') }, 100);
      setTimeout( () => { client.publish('fark', 'Hello mqtt 150') }, 150);
      setTimeout( () => { client.publish('fark', 'Hello mqtt 200') }, 200);
    }
  })
})

// Receive messages
client.on('message', (topic, message) => {
  console.log("RCV: " + message.toString())
})

setTimeout(() => {
  client.end();
  console.log("Program End");
}, 2000)