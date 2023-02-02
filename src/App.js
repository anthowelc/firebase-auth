import './styles.css'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  deleteUser
} from 'firebase/auth'
import { useState, useEffect } from 'react'

const firebaseConfig = {
  apiKey: 'AIzaSyDaLze5h98sv8-EugJAl5EDb5CXtLW3b0M',
  authDomain: 'auth-thread-twitter.firebaseapp.com',
  projectId: 'auth-thread-twitter',
  storageBucket: 'auth-thread-twitter.appspot.com',
  messagingSenderId: '1027288141093',
  appId: '1:1027288141093:web:33a58459ee92baeb6adecc'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

const providers = {
  google: googleProvider,
  github: githubProvider
}

const UserPage = () => {
  const user = auth.currentUser

  return (
    <div>
      <h1>{user.displayName}</h1>
      <p>{user.email}</p>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const displayName = user.displayName
        const email = user.email
        const photoURL = user.photoURL
        const emailVerified = user.emailVerified
        setUser(user)
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleLogin = async provider => {
    const { user } = await signInWithPopup(auth, providers[provider])
    setUser(user)
  }

  const handleChangeName = async () => {
    const num = Math.floor(Math.random() * 25)
    const newInfo = {
      displayName: num,
      photoURL: `https://randomuser.me/api/portraits/men/${num}.jpg`
    }
    try {
      await updateProfile(auth.currentUser, newInfo)
    } catch (error) {
      console.log(error)
    }

    setUser({
      ...user,
      ...newInfo
    })
  }

  const handleChangeEmail = async () => {
    const num = Math.floor(Math.random() * 1000)
    const email = `${num}@gmail.com`
    try {
      await updateEmail(auth.currentUser, email)
    } catch (error) {
      console.log(error)
    }

    setUser({
      ...user,
      email
    })
  }

  const removeUser = async () => {
    await deleteUser(auth.currentUser)
  }

  return (
    <div className='App'>
      {user ? (
        <>
          <h1>{user?.displayName}</h1>
          <p>
            {' '}
            <img src={user.photoURL} alt='' />
          </p>
          <p>{user.email}</p>
          <button onClick={() => handleChangeName(user)}>Change Name</button>
          <button onClick={() => handleChangeEmail(user)}>Change Email</button>
          <button onClick={() => signOut(auth)}>Signout</button>
          <button onClick={() => removeUser(user)}>delete</button>
          <hr />
          <UserPage />
        </>
      ) : (
        <>
          <button onClick={() => handleLogin('google')}>Login Google</button>
          <button onClick={() => handleLogin('github')}>Login Github</button>
        </>
      )}
    </div>
  )
}
