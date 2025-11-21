'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function AuthButton() {
  const { data } = useSession()
  const email = data?.user?.email
  const role = (data?.user as any)?.role
  return (
    <div className="flex items-center gap-3 text-sm">
      {email ? (
        <>
          <span className="text-muted-foreground">{email}{role ? ` • ${role}` : ''}</span>
          <Link href="/\(auth\)/logout" className="rounded border px-2 py-1 hover:bg-muted">Sign out</Link>
        </>
      ) : (
        <Link href="/\(auth\)/login" className="rounded border px-3 py-1 hover:bg-muted">Sign in</Link>
      )}
    </div>
  )
}


