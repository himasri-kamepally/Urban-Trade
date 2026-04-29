'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function LoginForm() {
  const { login, loginWithGoogle, setAuthModalView } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    try {
      await login(email, password)
    } catch {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error)
      setError('Google login failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Forgot password?
        </button>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || isGoogleLoading}
        className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? <Spinner className="h-5 w-5" /> : 'Sign In'}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading || isGoogleLoading}
        className="h-12 w-full gap-3 rounded-xl border-border bg-secondary text-foreground hover:bg-muted"
      >
        {isGoogleLoading ? <Spinner className="h-5 w-5" /> : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthModalView('signup')}
          className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Create account
        </button>
      </p>
    </form>
  )
}

function SignupForm() {
  const { signup, loginWithGoogle, setAuthModalView } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    try {
      await signup(name, email, password)
    } catch {
      setError('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error)
      setError('Google login failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || isGoogleLoading}
        className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? <Spinner className="h-5 w-5" /> : 'Create Account'}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading || isGoogleLoading}
        className="h-12 w-full gap-3 rounded-xl border-border bg-secondary text-foreground hover:bg-muted"
      >
        {isGoogleLoading ? <Spinner className="h-5 w-5" /> : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthModalView('login')}
          className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, authModalView } = useAuth()

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="rounded-2xl border-border bg-card p-6 sm:max-w-md">
        <DialogHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">U</span>
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {authModalView === 'login' ? 'Welcome back' : 'Create an account'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {authModalView === 'login'
              ? 'Sign in to access your dashboard, messages, and saved items.'
              : 'Join UrbanTrade to buy and sell locally with confidence.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {authModalView === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
