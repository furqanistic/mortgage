// File: client/src/pages/Auth/Auth.jsx
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
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    ChevronRight,
    Lock,
    Mail,
    PieChart,
    ShieldCheck,
    User,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector(selectCurrentUser)
  const loading = useSelector(selectIsLoading)

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
    setLoginData({
      ...loginData,
      [id]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSignupChange = (e) => {
    const { id, value, checked, type } = e.target
    setSignupData({
      ...signupData,
      [id]: type === 'checkbox' ? checked : value,
    })
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
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }
      toast.success('Access Granted')
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || 'Access Denied')
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match')
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
      toast.success('Account created. Please log in.')
      setSignupData({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', terms: false,
      })
      setActiveTab('login')
      dispatch(loginFailure())
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || 'Registration Failed')
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden font-body">
      <Navbar />
      
      <div className='relative min-h-[calc(100vh-80px)] flex items-center justify-center p-6 md:p-10'>
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10">
          
          {/* Left Column: Brand Pillars */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col space-y-12"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-black tracking-widest text-accent uppercase">
                  Secure Portal
                </span>
              </div>
              <h1 className="text-6xl xl:text-8xl font-black font-heading text-foreground leading-[0.9] tracking-tighter">
                Access <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">Ecosystem</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
                Manage your applications, documents, and property portfolio in one centralized, secure dashboard.
              </p>
            </div>

            <div className="grid gap-6">
               {[
                 { 
                   icon: Zap, 
                   title: "Real-Time Processing", 
                   desc: "Instant pre-approval status updates." 
                 },
                 { 
                   icon: PieChart, 
                   title: "Market Intelligence", 
                   desc: "Live interest rate monitoring & alerts." 
                 },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-5 p-4 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-accent shadow-sm">
                       <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-bold text-foreground">{item.title}</h3>
                       <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Column: Auth Interface */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-2xl border-border/50 rounded-[3rem] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent/50 to-primary/50" />
              
              <div className="p-8 md:p-12">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="h-auto grid w-full grid-cols-2 p-1 bg-secondary rounded-2xl mb-10">
                    <TabsTrigger value="login" className="rounded-xl py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-xl py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="login" className="focus-visible:outline-none">
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6" 
                        onSubmit={handleLoginSubmit}
                      >
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Credentials</label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                              <Input id="email" type="email" placeholder="Email Address" value={loginData.email} onChange={handleLoginChange}
                                className="w-full pl-11 h-12 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                              <Input id="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange}
                                className="w-full pl-11 h-12 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                            </div>
                            <div className="flex justify-end pr-2">
                               <button type="button" className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors">Forgot Password?</button>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/95 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                          type="submit" disabled={loading}>
                          {loading ? "Authenticating..." : <div className="flex items-center gap-2">Identify <ArrowRight className="w-4 h-4" /></div>}
                        </Button>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="signup" className="focus-visible:outline-none">
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5" 
                        onSubmit={handleSignupSubmit}
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                             <Input id="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange}
                               className="w-full h-12 px-4 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                          </div>
                          <div className="space-y-1.5">
                             <Input id="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange}
                               className="w-full h-12 px-4 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                           <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                              <Input id="email" type="email" placeholder="Email Address" value={signupData.email} onChange={handleSignupChange}
                                className="w-full pl-11 h-12 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                            <Input id="password" type="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange}
                              className="w-full pl-11 h-12 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                          </div>
                          <div className="relative group">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                             <Input id="confirmPassword" type="password" placeholder="Confirm" value={signupData.confirmPassword} onChange={handleSignupChange}
                              className="w-full pl-11 h-12 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none font-medium placeholder:text-muted-foreground/50" required />
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group p-1">
                          <input type="checkbox" id="terms" checked={signupData.terms} onChange={handleSignupChange}
                            className="w-4 h-4 mt-0.5 rounded border-2 border-border text-accent focus:ring-accent transition-all cursor-pointer" required />
                          <span className="text-xs font-medium text-muted-foreground leading-snug">
                            I accept the <button type="button" className="text-foreground font-bold hover:underline">Privacy Protocol</button> & <button type="button" className="text-foreground font-bold hover:underline">Terms</button>.
                          </span>
                        </label>

                        <Button className="w-full h-14 bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                          type="submit" disabled={loading}>
                          {loading ? "Processing..." : <div className="flex items-center gap-2">Initialize Account <ChevronRight className="w-4 h-4" /></div>}
                        </Button>
                      </motion.form>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Auth
