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
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building,
  ChevronRight,
  Euro,
  Home,
  Key,
  Lock,
  Mail,
  PieChart,
  User,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
      duration: 0.5,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get Redux state using selectors
  const currentUser = useSelector(selectCurrentUser)
  const loading = useSelector(selectIsLoading)

  // Form states
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

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectPath = currentUser.role === 'admin' ? '/admin' : '/'
      navigate(redirectPath)
    }
  }, [currentUser, navigate])

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { id, value, checked, type } = e.target
    setLoginData({
      ...loginData,
      [id]: type === 'checkbox' ? checked : value,
    })
  }

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { id, value, checked, type } = e.target
    setSignupData({
      ...signupData,
      [id]: type === 'checkbox' ? checked : value,
    })
  }

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const response = await axiosInstance.post('/auth/signin', {
        email: loginData.email,
        password: loginData.password,
      })

      // Dispatch full response data - our reducer will extract what we need
      dispatch(loginSuccess(response.data))

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)

        // Set auth header for future requests
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`
      }

      toast.success('Logged in successfully')

      // Redirect will happen via useEffect
    } catch (error) {
      dispatch(loginFailure())
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
    }
  }

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    // Validate passwords match
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
        role: 'user', // Default role for new users
      })

      toast.success('Account created successfully! Please log in.')

      // Reset form and switch to login tab
      setSignupData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      })

      setActiveTab('login')
      dispatch(loginFailure()) // Reset loading state
    } catch (error) {
      dispatch(loginFailure())
      toast.error(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      )
    }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col items-center justify-center relative p-4 md:p-8 overflow-hidden'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-[#155FA0] via-[#51A0D0] to-[#71C8DC] z-0'></div>

        {/* Animated background illustrations */}
        <div className='absolute inset-0 z-0'>
          {/* Buildings silhouette */}
          <motion.svg
            className='absolute bottom-0 left-0 w-full opacity-20'
            viewBox='0 0 1440 320'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.2, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <path
              fill='#ffffff'
              d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
            ></path>
          </motion.svg>

          {/* Floating house icons */}
          <motion.div
            className='absolute top-16 left-12 text-white/10 md:text-white/20'
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2 }}
          >
            <Home size={80} />
          </motion.div>

          <motion.div
            className='absolute top-1/4 right-16 text-white/10 md:text-white/20'
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2, delay: 0.3 }}
          >
            <Home size={120} />
          </motion.div>

          <motion.div
            className='absolute bottom-24 right-8 text-white/10 md:text-white/15'
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2, delay: 0.6 }}
          >
            <Home size={60} />
          </motion.div>

          {/* Abstract decorative elements */}
          <motion.div
            className='absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-white/5'
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2 }}
          />

          <motion.div
            className='absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-white/5'
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, delay: 0.4 }}
          />
        </div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className='w-full max-w-md mb-8 text-center'
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className='inline-flex items-center gap-2 mb-2'
          >
            <Home className='w-8 h-8 text-white' />
            <h1 className='text-3xl font-bold text-white'>Baufiking</h1>
          </motion.div>
          <p className='text-white/90 text-lg'>
            Your AI mortgage assistant for Germany
          </p>
        </motion.div>

        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='w-full max-w-md'
        >
          <Card className='p-6 md:p-8 shadow-xl bg-white/95 backdrop-blur rounded-2xl'>
            <Tabs
              defaultValue='login'
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='grid grid-cols-2 mb-6'>
                <TabsTrigger value='login' className='text-base'>
                  Login
                </TabsTrigger>
                <TabsTrigger value='signup' className='text-base'>
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent value='login'>
                <motion.form
                  variants={containerVariants}
                  className='space-y-4'
                  onSubmit={handleLoginSubmit}
                >
                  <motion.div variants={itemVariants}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      htmlFor='email'
                    >
                      Email
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='your.email@example.com'
                        className='pl-10 border-gray-300'
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      htmlFor='password'
                    >
                      Password
                    </label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <Input
                        id='password'
                        type='password'
                        placeholder='••••••••'
                        className='pl-10 border-gray-300'
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center'>
                      <input
                        id='rememberMe'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-[#155FA0] focus:ring-[#51A0D0]'
                        checked={loginData.rememberMe}
                        onChange={handleLoginChange}
                      />
                      <label
                        htmlFor='rememberMe'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Remember me
                      </label>
                    </div>
                    <div className='text-sm'>
                      <a
                        href='#'
                        className='font-medium text-[#155FA0] hover:text-[#51A0D0]'
                      >
                        Forgot password?
                      </a>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      className='w-full bg-[#155FA0] hover:bg-[#51A0D0] text-white flex items-center justify-center gap-2'
                      type='submit'
                      disabled={loading}
                    >
                      {loading ? (
                        'Signing in...'
                      ) : (
                        <>
                          <span>Sign in</span>
                          <ArrowRight className='h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>

              <TabsContent value='signup'>
                <motion.form
                  variants={containerVariants}
                  className='space-y-4'
                  onSubmit={handleSignupSubmit}
                >
                  <motion.div
                    variants={itemVariants}
                    className='grid grid-cols-2 gap-4'
                  >
                    <div>
                      <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        htmlFor='firstName'
                      >
                        First Name
                      </label>
                      <div className='relative'>
                        <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                        <Input
                          id='firstName'
                          placeholder='John'
                          className='pl-10 border-gray-300'
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        htmlFor='lastName'
                      >
                        Last Name
                      </label>
                      <Input
                        id='lastName'
                        placeholder='Doe'
                        className='border-gray-300'
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      htmlFor='email'
                    >
                      Email
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='your.email@example.com'
                        className='pl-10 border-gray-300'
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      htmlFor='password'
                    >
                      Password
                    </label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <Input
                        id='password'
                        type='password'
                        placeholder='••••••••'
                        className='pl-10 border-gray-300'
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      htmlFor='confirmPassword'
                    >
                      Confirm Password
                    </label>
                    <div className='relative'>
                      <Key className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='••••••••'
                        className='pl-10 border-gray-300'
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className='flex items-center'
                  >
                    <input
                      id='terms'
                      name='terms'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-[#155FA0] focus:ring-[#51A0D0]'
                      checked={signupData.terms}
                      onChange={handleSignupChange}
                      required
                    />
                    <label
                      htmlFor='terms'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      I agree to the{' '}
                      <a
                        href='#'
                        className='text-[#155FA0] hover:text-[#51A0D0]'
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href='#'
                        className='text-[#155FA0] hover:text-[#51A0D0]'
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      className='w-full bg-[#155FA0] hover:bg-[#51A0D0] text-white flex items-center justify-center gap-2'
                      type='submit'
                      disabled={loading}
                    >
                      {loading ? (
                        'Creating Account...'
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ChevronRight className='h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className='mt-8 text-white/80 text-center text-sm z-10'
        >
          <div className='flex items-center justify-center space-x-6 mb-4'>
            <motion.div
              className='flex flex-col items-center'
              whileHover={{ y: -3 }}
            >
              <Building className='h-6 w-6 mb-1' />
              <span className='text-xs'>Property Search</span>
            </motion.div>
            <motion.div
              className='flex flex-col items-center'
              whileHover={{ y: -3 }}
            >
              <Euro className='h-6 w-6 mb-1' />
              <span className='text-xs'>Financing</span>
            </motion.div>
            <motion.div
              className='flex flex-col items-center'
              whileHover={{ y: -3 }}
            >
              <PieChart className='h-6 w-6 mb-1' />
              <span className='text-xs'>AI Insights</span>
            </motion.div>
          </div>
          <p>Simplifying home buying in Germany with expert guidance</p>
          <p className='mt-1'>© 2025 Baufiking. All rights reserved.</p>
        </motion.div>
      </div>
    </>
  )
}

export default Auth
