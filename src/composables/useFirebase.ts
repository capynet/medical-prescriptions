// Get the imports
import { initializeApp } from 'firebase/app'

// Init the firebase app.
export const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FB_APIKEY,
    authDomain: "recetas-medicas-63632.firebaseapp.com",
    projectId: "recetas-medicas-63632",
    storageBucket: "recetas-medicas-63632.appspot.com",
    messagingSenderId: "159493741209",
    appId: "1:159493741209:web:6beed841cc5c8c348db608"
})
