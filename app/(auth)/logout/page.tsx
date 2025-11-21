'use client'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' })
  }, [])
  return <div className="p-6 text-sm text-muted-foreground">Signing out…</div>
}


