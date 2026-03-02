import express from 'express'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'

const app = express()

app.get('/', (req, res) => {
  res.send('WhatsApp Session Generator شغال')
})

app.listen(3000, () => console.log('Server running'))
