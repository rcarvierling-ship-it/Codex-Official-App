'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
<<<<<<< HEAD
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
=======
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const callbackUrl = '/dashboard'

  return (
<<<<<<< HEAD
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-6 sm:p-8 shadow-xl backdrop-blur">
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign in with your email and password.
          </p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            const res = await signIn('credentials', { email, password, redirect: false })
            setLoading(false)
            if (res?.ok) router.push(callbackUrl)
          }}
          className="space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="text-sm sm:text-base"
              aria-label="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="text-sm sm:text-base"
              aria-label="Password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] text-sm sm:text-base py-6 sm:py-7"
          >
            {loading ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground text-center">
          Only authorized users can sign in.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs sm:text-sm text-[hsl(var(--accent))] hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
=======
    <div className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-muted-foreground">Sign in with your email and password.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          const res = await signIn('credentials', { email, password, redirect: false })
          setLoading(false)
          if (res?.ok) router.push(callbackUrl)
        }}
        className="space-y-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded border bg-background p-2"
          aria-label="Email"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded border bg-background p-2"
          aria-label="Password"
        />
        <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <p className="text-xs text-muted-foreground">Only authorized users can sign in.</p>
    </div>
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
  )
}


