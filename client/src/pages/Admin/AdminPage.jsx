import {
  ArrowRight,
  Calendar,
  FileEdit,
  Home,
  TrendingUp,
  Users,
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout'

const AdminPage = () => {
  const shortcuts = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
    },
    {
      name: 'Blog',
      href: '/blog-edit',
      icon: FileEdit,
    },
  ]

  return (
    <Layout>
      <div className='bg-blue-50 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-semibold text-blue-800  px-6 py-3 rounded-lg '>
              Admin Dashboard
            </h1>
          </div>

          {/* Analytics summary */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden'>
              <div className='px-6 py-5 border-blue-700'>
                <p className='text-sm font-medium text-blue-200'>Total Users</p>
                <div className='flex items-center justify-between mt-2'>
                  <p className='text-3xl font-semibold text-white'>2,584</p>
                  <div className='bg-blue-700 p-3 rounded-full'>
                    <Users className='h-6 w-6 text-blue-100' />
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden'>
              <div className='px-6 py-5  border-blue-600'>
                <p className='text-sm font-medium text-blue-200'>
                  Appointments
                </p>
                <div className='flex items-center justify-between mt-2'>
                  <p className='text-3xl font-semibold text-white'>243</p>
                  <div className='bg-blue-600 p-3 rounded-full'>
                    <Calendar className='h-6 w-6 text-blue-100' />
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-blue-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden'>
              <div className='px-6 py-5  border-blue-500'>
                <p className='text-sm font-medium text-blue-100'>Blog Posts</p>
                <div className='flex items-center justify-between mt-2'>
                  <p className='text-3xl font-semibold text-white'>48</p>
                  <div className='bg-blue-500 p-3 rounded-full'>
                    <FileEdit className='h-6 w-6 text-blue-100' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-medium text-blue-700  px-4 py-2 rounded-md inline-block'>
                Quick Access
              </h2>
              <button className='text-sm text-white bg-blue-600 px-3 py-1 rounded flex items-center hover:bg-blue-700'>
                View All <ArrowRight className='h-4 w-4 ml-1' />
              </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              {shortcuts.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className='flex items-center p-5 bg-blue-100 border border-blue-200 shadow-sm rounded-lg hover:shadow hover:bg-blue-200 transition-all duration-200 group'
                >
                  <div className='p-3 rounded-full bg-blue-600 text-white mr-4 group-hover:scale-110 transition-transform duration-200'>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className='text-base font-medium text-slate-800'>
                      {item.name}
                    </h3>
                    <p className='text-xs text-slate-600 mt-1'>
                      Quick access to {item.name.toLowerCase()} section
                    </p>
                  </div>
                  <ArrowRight className='h-4 w-4 text-slate-500 ml-auto group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-200' />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminPage
