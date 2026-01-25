// pages/Users.jsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import Layout from './Layout'

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // Sample user data
  const users = [
    {
      id: 'u1',
      name: 'Marie Schmidt',
      email: 'marie.s@example.com',
      status: 'Active',
      joinDate: '10 Mar 2025',
      initials: 'MS',
    },
    {
      id: 'u2',
      name: 'Jan Kowalski',
      email: 'jan.k@example.com',
      status: 'Pending',
      joinDate: '11 Mar 2025',
      initials: 'JK',
    },
    {
      id: 'u3',
      name: 'Anna Weber',
      email: 'anna.w@example.com',
      status: 'New',
      joinDate: '12 Mar 2025',
      initials: 'AW',
    },
    {
      id: 'u4',
      name: 'Lukas Pohl',
      email: 'lukas.p@example.com',
      status: 'Active',
      joinDate: '13 Mar 2025',
      initials: 'LP',
    },
    {
      id: 'u5',
      name: 'Brigitte Neumann',
      email: 'brigitte.n@example.com',
      status: 'Pending',
      joinDate: '14 Mar 2025',
      initials: 'BN',
    },
  ]

  // Number of users per page
  const usersPerPage = 5

  // Total number of pages (simulated)
  const totalPages = 5

  // Previous page handler
  const handlePreviousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1))
  }

  // Next page handler
  const handleNextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages))
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600'
      case 'Pending':
        return 'bg-slate-100 text-slate-600'
      case 'New':
        return 'bg-blue-50 text-blue-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <Layout>
      <div className='container mx-auto'>
        {/* Page title */}
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold text-[#155FA0]'>
            Registered Users
          </h2>
          <p className='text-gray-500'>Manage user accounts and permissions</p>
        </div>

        <Card className='border-none shadow-sm overflow-hidden'>
          <CardHeader className='border-b border-gray-100 bg-white'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <CardTitle className='text-lg text-[#155FA0]'>
                  Registered Users
                </CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </div>
              <div className='flex gap-2'>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                  <Input
                    type='search'
                    placeholder='Search users...'
                    className='pl-9 w-full md:w-[220px] bg-gray-50'
                  />
                </div>
                <Button className='bg-[#51A0D0] hover:bg-[#155FA0]'>
                  <UserPlus className='mr-2 h-4 w-4' />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Filters section */}
          <div className='flex flex-wrap justify-between items-center gap-3 p-4 bg-gray-50 border-b border-gray-100'>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='text-gray-500 flex items-center'
              >
                <Filter className='h-3.5 w-3.5 mr-1' />
                Filter
              </Button>

              <Badge
                variant='outline'
                className='bg-white border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
              >
                Active
                <span className='ml-1 text-gray-400'>×</span>
              </Badge>

              <Badge
                variant='outline'
                className='bg-white border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
              >
                New users
                <span className='ml-1 text-gray-400'>×</span>
              </Badge>
            </div>

            <Button variant='outline' size='sm' className='text-gray-500'>
              <Download className='h-3.5 w-3.5 mr-1' />
              Export
            </Button>
          </div>

          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-50 border-b border-gray-100'>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Joined
                    </th>
                    <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-4 py-3'>
                        <div className='flex items-center'>
                          <Avatar className='h-8 w-8 mr-3'>
                            <AvatarFallback className='bg-gradient-to-br from-[#71C8DC] to-[#51A0D0] text-white'>
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className='font-medium text-gray-900'>
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-500'>
                        {user.email}
                      </td>
                      <td className='px-4 py-3'>
                        <Badge className={getStatusBadgeClass(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-500'>
                        {user.joinDate}
                      </td>
                      <td className='px-4 py-3 text-right'>
                        <div className='flex justify-end items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-gray-500 hover:text-[#155FA0]'
                          >
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>

          <CardFooter className='justify-between border-t border-gray-100 p-4'>
            <div className='text-sm text-gray-500'>
              Showing {usersPerPage} of 1,245 users (Page {currentPage} of{' '}
              {totalPages})
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className='text-gray-500'
              >
                <ChevronLeft className='h-4 w-4 mr-1' />
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className='text-gray-500'
              >
                Next
                <ChevronRight className='h-4 w-4 ml-1' />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* User Statistics Card */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='border-none shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg text-[#155FA0]'>
                User Statistics
              </CardTitle>
              <CardDescription>
                Overview of user activity and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm font-medium text-gray-600'>
                    Active Users
                  </div>
                  <div className='text-lg font-semibold text-[#155FA0]'>
                    842
                  </div>
                </div>
                <div className='w-full bg-gray-100 rounded-full h-2.5'>
                  <div className='bg-[#51A0D0] h-2.5 rounded-full w-[68%]'></div>
                </div>

                <div className='flex justify-between items-center pt-2'>
                  <div className='text-sm font-medium text-gray-600'>
                    New Users (This Month)
                  </div>
                  <div className='text-lg font-semibold text-[#155FA0]'>
                    124
                  </div>
                </div>
                <div className='w-full bg-gray-100 rounded-full h-2.5'>
                  <div className='bg-[#71C8DC] h-2.5 rounded-full w-[10%]'></div>
                </div>

                <div className='flex justify-between items-center pt-2'>
                  <div className='text-sm font-medium text-gray-600'>
                    Completed Profiles
                  </div>
                  <div className='text-lg font-semibold text-[#155FA0]'>
                    976
                  </div>
                </div>
                <div className='w-full bg-gray-100 rounded-full h-2.5'>
                  <div className='bg-[#155FA0] h-2.5 rounded-full w-[78%]'></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg text-[#155FA0]'>
                Recent Activity
              </CardTitle>
              <CardDescription>Latest user interactions</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='divide-y divide-gray-100'>
                {[
                  {
                    user: 'Marie Schmidt',
                    action: 'updated profile',
                    time: '2 hours ago',
                  },
                  {
                    user: 'Jan Kowalski',
                    action: 'scheduled an appointment',
                    time: '3 hours ago',
                  },
                  {
                    user: 'Anna Weber',
                    action: 'viewed properties',
                    time: '5 hours ago',
                  },
                  {
                    user: 'Lukas Pohl',
                    action: 'submitted financing application',
                    time: '1 day ago',
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between py-3 px-6'
                  >
                    <div className='flex items-center'>
                      <Avatar className='h-8 w-8 mr-3'>
                        <AvatarFallback className='bg-gradient-to-br from-[#71C8DC] to-[#51A0D0] text-white'>
                          {activity.user
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {activity.user}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {activity.action}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs text-gray-400'>{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default UsersPage
