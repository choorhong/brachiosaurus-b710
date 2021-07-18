import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
  databaseURL: 'https://brachiosaurus-109e7-default-rtdb.firebaseio.com'
})

export default admin
