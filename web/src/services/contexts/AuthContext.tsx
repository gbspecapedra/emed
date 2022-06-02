import { encode } from 'js-base64'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { Professional } from '../../models'
import { ProfessionalRole } from '../../models/enums'
import { EMED_TOKEN, EMED_USER } from '../../utils'

import { api } from '../api'

import { useNotification } from '../hooks/useNotification'

type AuthenticationInputs = Pick<Professional, 'email' | 'password'>

type AuthContextData = {
  signIn: (_credentials: AuthenticationInputs) => Promise<void>
  signOut: () => Promise<void>
  findUserByEmail: (
    _credentials: Pick<AuthenticationInputs, 'email'>,
  ) => Promise<void>
  resetPassword: (_credentials: AuthenticationInputs) => Promise<void>
  professional: Professional | null
  isAuthenticated: boolean
  role?: ProfessionalRole
}

interface IAuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: IAuthProviderProps) {
  const notification = useNotification()

  const [professional, setProfessional] = useState<Professional | null>(null)
  const isAuthenticated = !!professional
  const role = professional?.role

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
        .catch(({ response }) => {
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

  async function findUserByEmail(
    credentials: Pick<AuthenticationInputs, 'email'>,
  ) {
    try {
      await api
        .post('/find', credentials)
        .then(({ data: { user } }) => {
          notification.success({
            title: 'Validated email.',
            to: '/password/[email]',
            query: { email: encode(user.email, true) },
          })
        })
        .catch(({ response }) =>
          notification.error({ message: response.data.error }),
        )
    } catch (error) {
      notification.error()
    }
  }

  async function resetPassword(
    credentials: Pick<AuthenticationInputs, 'password'>,
  ) {
    try {
      await api
        .post('/reset', credentials)
        .then(() => {
          notification.success({
            title: 'Password updated.',
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
        findUserByEmail,
        resetPassword,
        professional,
        isAuthenticated,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
