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
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  Lock,
  Mail,
  PieChart,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] 
    },
  },
}

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
      toast.success('Logged in successfully')
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
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
      toast.success('Account created successfully! Please log in.')
      setSignupData({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', terms: false,
      })
      setActiveTab('login')
      dispatch(loginFailure())
    } catch (error) {
      dispatch(loginFailure())
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] transition-colors duration-500 overflow-x-hidden">
      <Navbar />
      
      <div className='relative min-h-[calc(100vh-140px)] flex items-center justify-center p-6 md:p-10'>
        {/* Decorative background elements - Subtle & Premium */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#0A192F]/10 dark:bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
          
          {/* Left Column: Branding & Value Proposition */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="hidden lg:flex flex-col space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold tracking-widest text-[#0A192F] dark:text-gray-300 uppercase">
                  Secure Portal
                </span>
              </div>
              <h1 className="text-5xl xl:text-7xl font-bold font-heading text-[#0A192F] dark:text-white leading-tight">
                Unlock Your <span className="text-[#D4AF37]">German Home</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-body leading-relaxed max-w-lg">
                Your AI-powered mortgage journey starts here. Expert advice, 
                premium solutions, and transparent guidance every step of the way.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: Zap, title: "Fast Approval", desc: "Get pre-approved in minutes" },
                { icon: PieChart, title: "Best Rates", desc: "Access 400+ lenders" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <feature.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A192F] dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Auth Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-8 md:p-12 bg-white dark:bg-[#0A192F]/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="h-auto grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-sm mb-12 border border-slate-200 dark:border-white/10">
                  <TabsTrigger value="login" className="rounded-xl py-2.5 font-bold text-sm data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl py-2.5 font-bold text-sm data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                    Register
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login">
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8" 
                      onSubmit={handleLoginSubmit}
                    >
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                            <Input id="email" type="email" placeholder="name@example.com" value={loginData.email} onChange={handleLoginChange}
                              className="w-full pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                            <button type="button" className="text-xs font-bold text-[#D4AF37] hover:underline">Forgot?</button>
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                            <Input id="password" type="password" placeholder="••••••••" value={loginData.password} onChange={handleLoginChange}
                              className="w-full pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                          </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" id="rememberMe" checked={loginData.rememberMe} onChange={handleLoginChange}
                            className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-[#D4AF37] focus:ring-[#D4AF37] transition-all cursor-pointer" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Remember me on this device</span>
                        </label>
                      </div>

                      <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#D4AF37]/20 transition-all active:scale-[0.98]" 
                        type="submit" disabled={loading}>
                        {loading ? "Signing in..." : <div className="flex items-center gap-2">Sign In <ArrowRight className="w-5 h-5" /></div>}
                      </Button>
                    </motion.form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6" 
                      onSubmit={handleSignupSubmit}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">First Name</label>
                          <Input id="firstName" placeholder="John" value={signupData.firstName} onChange={handleSignupChange}
                            className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Last Name</label>
                          <Input id="lastName" placeholder="Doe" value={signupData.lastName} onChange={handleSignupChange}
                            className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                        <Input id="email" type="email" placeholder="your@email.com" value={signupData.email} onChange={handleSignupChange}
                          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                        <Input id="password" type="password" placeholder="••••••••" value={signupData.password} onChange={handleSignupChange}
                          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" value={signupData.confirmPassword} onChange={handleSignupChange}
                          className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] dark:text-white transition-all outline-none" required />
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" id="terms" checked={signupData.terms} onChange={handleSignupChange}
                          className="w-5 h-5 mt-0.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-[#D4AF37] focus:ring-[#D4AF37] transition-all cursor-pointer" required />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          I agree to the <button type="button" className="text-[#D4AF37] font-bold">Terms of Service</button> and <button type="button" className="text-[#D4AF37] font-bold">Privacy Policy</button>
                        </span>
                      </label>

                      <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#D4AF37]/20 transition-all active:scale-[0.98]" 
                        type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : <div className="flex items-center gap-2">Create Account <ChevronRight className="w-5 h-5" /></div>}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Auth
