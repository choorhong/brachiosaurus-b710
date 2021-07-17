import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
  databaseURL: 'https://react-hook-a421e.firebaseio.com'
})

export default admin
