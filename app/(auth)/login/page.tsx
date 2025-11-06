'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const callbackUrl = '/dashboard'

  return (
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
  )
}


