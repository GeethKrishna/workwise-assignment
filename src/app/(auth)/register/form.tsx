'use client'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      password,
    })
    try {
      const res = await fetch('api/user', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        signIn()
      } else {
        setError((await res.json()).error)
      }
    } catch (error: any) {
      setError(error?.message)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          className="w-full"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="text"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          className="w-full"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Set your password</Label>
        <Input
          className="w-full"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      {
        error && 
        <div className='flex flex-col gap-2'>
          <Label className='text-red-400 text-md'>Error</Label>
          <Alert className='text-red-400'>{error}</Alert>
        </div>
      }
      <div className="w-full flex items-center justify-center">
        <Button size={'lg'}>
          Register
        </Button>
      </div>
    </form>
  )
}