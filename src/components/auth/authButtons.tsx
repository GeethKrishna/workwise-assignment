'use client'

import { signIn, signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import {useRouter} from 'next/navigation'

export const LoginButton = () => {
  return <Button onClick={() => signIn()}>Sign in</Button>
}

export const LogoutButton = () => {
  return <Button onClick={() => signOut()}>Sign Out</Button>
}

export const RegisterButton = () => {
  const router = useRouter()
  return <Button onClick={() => router.push('/register')}>Sign up</Button>
}