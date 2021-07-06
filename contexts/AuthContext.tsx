import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/apiClient';

type User = {
  email: string;
  permissions: string[];
  roles: string[]
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}
let authChannel: BroadcastChannel
export function signOut() {

  destroyCookie(undefined, 'auth.token')
  destroyCookie(undefined, 'auth.refreshToken')
  authChannel.postMessage('signOut')
  Router.push('/')
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user;

  useEffect(()=>{
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();
    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data
        setUser({
          email,
          permissions,
          roles
        })
      }).catch(err => {
        signOut()
      })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email, password
      })
      const { token, refreshToken, permissions, roles } = response.data
      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setCookie(undefined, 'auth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setUser({
        email,
        permissions,
        roles
      })
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      Router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
