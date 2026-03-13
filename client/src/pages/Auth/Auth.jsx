import Navbar from '@/components/Home/Navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { axiosInstance } from '@/config'
import {
  loginFailure,
  loginStart,
  loginSuccess,
  selectCurrentUser,
  selectIsLoading,
} from '@/redux/userSlice'
import { Lock, Mail, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Auth = ({ language = 'de', onLanguageChange }) => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector(selectCurrentUser)
  const loading = useSelector(selectIsLoading)
  const isEnglish = language === 'en'

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  useEffect(() => {
    if (currentUser) {
      const redirectPath = currentUser.role === 'admin' ? '/admin' : '/'
      navigate(redirectPath)
    }
  }, [currentUser, navigate])

  const handleLoginChange = (e) => {
    const { id, value, checked, type } = e.target
    setLoginData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSignupChange = (e) => {
    const { id, value, checked, type } = e.target
    setSignupData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const response = await axiosInstance.post('/auth/signin', {
        email: loginData.email,
        password: loginData.password,
      })

      dispatch(loginSuccess(response.data))

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
      }

      toast.success(isEnglish ? 'Welcome back' : 'Willkommen zurueck')
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || (isEnglish ? 'Login failed' : 'Anmeldung fehlgeschlagen'))
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    if (signupData.password !== signupData.confirmPassword) {
      toast.error(isEnglish ? 'Passwords do not match' : 'Passwoerter stimmen nicht ueberein')
      dispatch(loginFailure())
      return
    }

    try {
      await axiosInstance.post('/auth/signup', {
        name: `${signupData.firstName} ${signupData.lastName}`.trim(),
        email: signupData.email,
        password: signupData.password,
        role: 'user',
      })

      toast.success(isEnglish ? 'Account created. Please sign in.' : 'Konto erstellt. Bitte anmelden.')
      setSignupData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      })
      setActiveTab('login')
      dispatch(loginFailure())
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || (isEnglish ? 'Registration failed' : 'Registrierung fehlgeschlagen'))
    }
  }

  const copy = isEnglish
    ? {
        badge: 'Secure Access',
        title: 'Sign in to continue',
        subtitle: 'One account for dashboard, tools, and updates.',
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        firstName: 'First name',
        lastName: 'Last name',
        confirmPassword: 'Confirm password',
        terms: 'I accept the privacy policy and terms.',
        loginButton: loading ? 'Signing in...' : 'Sign In',
        registerButton: loading ? 'Creating account...' : 'Create Account',
      }
    : {
        badge: 'Sicherer Zugang',
        title: 'Anmelden und weiter',
        subtitle: 'Ein Konto fuer Dashboard, Tools und Updates.',
        login: 'Login',
        register: 'Registrieren',
        email: 'E-Mail',
        password: 'Passwort',
        firstName: 'Vorname',
        lastName: 'Nachname',
        confirmPassword: 'Passwort bestaetigen',
        terms: 'Ich akzeptiere Datenschutz und Bedingungen.',
        loginButton: loading ? 'Anmeldung...' : 'Anmelden',
        registerButton: loading ? 'Konto wird erstellt...' : 'Konto erstellen',
      }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f8f5] font-body text-foreground">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className="relative px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden rounded-3xl border border-[#dde2da] bg-white/80 p-8 shadow-[0_12px_30px_rgba(15,47,36,0.08)] backdrop-blur md:block">
            <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {copy.badge}
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold text-[#0f2f24]">{copy.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{copy.subtitle}</p>
          </section>

          <Card className="rounded-3xl border border-[#dde2da] bg-white p-6 shadow-[0_16px_36px_rgba(15,47,36,0.12)] sm:p-8">
            <div className="mb-5 md:hidden">
              <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {copy.badge}
              </p>
              <h1 className="mt-3 font-heading text-2xl font-bold text-[#0f2f24]">{copy.title}</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid h-11 w-full grid-cols-2 rounded-xl bg-[#eef2eb] p-1">
                <TabsTrigger value="login" className="rounded-lg text-sm font-semibold">
                  {copy.login}
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg text-sm font-semibold">
                  {copy.register}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.email}</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.password}</span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        required
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                      />
                    </div>
                  </label>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    {copy.loginButton}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.firstName}</span>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="firstName"
                          required
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.lastName}</span>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="lastName"
                          required
                          value={signupData.lastName}
                          onChange={handleSignupChange}
                          className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.email}</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                      />
                    </div>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.password}</span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          required
                          value={signupData.password}
                          onChange={handleSignupChange}
                          className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">{copy.confirmPassword}</span>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          className="h-11 rounded-xl border-[#c9d1c7] bg-white pl-10 focus-visible:ring-primary/30"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={signupData.terms}
                      onChange={handleSignupChange}
                      required
                      className="h-4 w-4 rounded border-[#c9d1c7] text-primary focus:ring-primary/30"
                    />
                    {copy.terms}
                  </label>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    {copy.registerButton}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Auth
