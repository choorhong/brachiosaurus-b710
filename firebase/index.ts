import admin from 'firebase-admin'
import { config } from 'dotenv'
config()

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_DB } = process.env

if (!FIREBASE_PRIVATE_KEY) throw new Error('Firebase env missing')

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL
  }),
  databaseURL: FIREBASE_DB
})

export default admin
