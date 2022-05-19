import { parseCookies, destroyCookie, setCookie } from 'nookies'
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { Professional } from '../../models'
import { EMED_TOKEN, EMED_USER } from '../../utils'

import { api } from '../api'

import { useNotification } from '../hooks/useNotification'

type AuthenticationInputs = Pick<Professional, 'email' | 'password'>

type AuthContextData = {
  signIn: (_credentials: AuthenticationInputs) => void
  signOut: () => Promise<void>
  resetPassword: (_email: Pick<AuthenticationInputs, 'email'>) => Promise<void>
  professional: Professional | null
  isAuthenticated: boolean
}

interface IAuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: IAuthProviderProps) {
  const notification = useNotification()

  const [professional, setProfessional] = useState<Professional | null>(null)
  const isAuthenticated = !!professional

  useEffect(() => {
    const { [EMED_TOKEN]: token } = parseCookies()

    if (token) {
      const exists = localStorage.getItem(EMED_USER)
      if (exists) setProfessional(JSON.parse(exists))
    } else {
      localStorage.removeItem(EMED_USER)
    }
  }, [])

  useEffect(() => {
    if (professional)
      localStorage.setItem(EMED_USER, JSON.stringify(professional))
  }, [professional])

  async function signIn(credentials: AuthenticationInputs) {
    try {
      await api
        .post('/login', credentials)
        .then(({ data: { user, access } }) => {
          setCookie(undefined, EMED_TOKEN, access.token, {
            maxAge: new Date(access.expires_at) ?? 60 * 60 * 24, // 24 hours
          })

          setProfessional(user)

          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${access.token}`

          notification.success({
            title: 'Successfully logged in!',
            to: 'dashboard',
          })
        })
        .catch(response => {
          notification.error({ message: response.data.error })
        })
    } catch (error) {
      notification.error()
    }
  }

  async function signOut() {
    try {
      await api
        .post('/logout')
        .then(() => {
          destroyCookie(undefined, EMED_TOKEN)
          localStorage.removeItem(EMED_USER)
          setProfessional(null)
          notification.success({
            title: 'Successfully logged out!',
            to: '/',
          })
        })
        .catch(({ response }) =>
          notification.error({ message: response.data.error }),
        )
    } catch (error) {
      notification.error()
    }
  }

  async function resetPassword(email: Pick<AuthenticationInputs, 'email'>) {
    try {
      await api
        .post('/reset', email)
        .then(() => {
          notification.success({
            title: 'Password sent to your email',
            to: '/',
          })
        })
        .catch(({ response }) =>
          notification.error({ message: response.data.error }),
        )
    } catch (error) {
      notification.error()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        resetPassword,
        professional,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
