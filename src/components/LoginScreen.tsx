import { useState } from 'react'
import { ChevronLeft, Mail, Lock /* Apple */ } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Logo } from './Logo'
import { supabase } from '../lib/supabase'

interface LoginScreenProps {
  onLogin: (userData: {
    email: string
    name: string
    authMethod: 'google' | 'apple' | 'email'
    isLogin: boolean
  }) => void
  onBack: () => void
  mode?: 'login' | 'signup'
}

/**
 * LoginScreen now uses Supabase for:
 * - Google OAuth (redirect flow)
 * - Email/password login & sign-up
 * Apple is hidden for now.
 */
export function LoginScreen({ onLogin, onBack, mode = 'signup' }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const SHOW_APPLE = false // toggle to true when you’re ready to support Apple

  // --- GOOGLE OAUTH (redirect) ---
  const handleGoogleAuth = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // after Google, return here
        },
      })
      if (error) {
        alert(error.message)
        setIsLoading(false)
      }
      // No onLogin call here because we redirect; your app should read the session on load.
    } catch (err: any) {
      alert(err?.message || 'Google sign-in failed.')
      setIsLoading(false)
    }
  }

  // --- EMAIL/PASSWORD ---
  // If isLogin = true → signIn; else signUp
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (!isLogin && !name)) return
    setIsLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // Best effort display name
        const displayName =
          data.user?.user_metadata?.full_name ||
          data.user?.user_metadata?.name ||
          email.split('@')[0]

        onLogin({
          email: data.user?.email || email,
          name: displayName,
          authMethod: 'email',
          isLogin: true,
        })
      } else {
        // Sign up – you may get a confirmation email depending on your Supabase settings
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        })
        if (error) throw error

        const displayName =
          data.user?.user_metadata?.full_name ||
          data.user?.user_metadata?.name ||
          name

        onLogin({
          email: data.user?.email || email,
          name: displayName,
          authMethod: 'email',
          isLogin: false,
        })
      }
    } catch (err: any) {
      alert(err?.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Optional: simple password reset using Supabase
  const handlePasswordReset = async () => {
    if (!email) {
      alert('Please enter your email address first')
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // where Supabase should send the user to set a new password
      })
      if (error) throw error
      alert(`If an account exists for ${email}, a reset link has been sent.`)
    } catch (err: any) {
      alert(err?.message || 'Could not start the reset flow.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size={80} />
          </div>
          <h1 className="text-3xl mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-lg text-gray-600">
            {isLogin ? 'Log in to continue your fitness journey' : 'Join the fitness community'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            variant="outline"
            className="w-full border-2 border-gray-300 rounded-full h-12 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          {/* Apple hidden for now */}
          {SHOW_APPLE && (
            <Button
              onClick={() => alert('Apple Sign-In is disabled for now')}
              disabled={isLoading}
              variant="outline"
              className="w-full border-2 border-gray-300 rounded-full h-12 disabled:opacity-50"
            >
              {/* <Apple className="w-5 h-5 mr-2" /> */}
              Continue with Apple
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Email Form (Supabase email/password) */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Full Name</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF]"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF]"
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-[#0066FF]" onClick={handlePasswordReset}>
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email || !password || (!isLogin && !name)}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-12 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </form>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm text-gray-600 pb-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#0066FF]">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}

    </div>
  );
}
