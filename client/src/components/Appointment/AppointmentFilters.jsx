import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search } from 'lucide-react'
import React from 'react'

const AppointmentFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  appointmentTypes,
  appointmentStatuses,
  dateRanges,
}) => {
  return (
    <div className='border-b border-gray-200 pb-5'>
      <div className='flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between'>
        {/* Left - Title */}
        <div>
          <h1 className='text-2xl font-bold text-[#155FA0]'>Appointments</h1>
          <p className='text-gray-500'>Manage your client appointments</p>
        </div>
      </div>

      {/* Controls Row */}
      <div className='mt-6 flex flex-wrap items-center gap-3'>
        {/* Search */}
        <div className='relative w-full md:w-auto md:min-w-[200px] md:flex-grow-0'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full md:w-[180px] border-gray-300'>
            <SelectValue placeholder='All Statuses' />
          </SelectTrigger>
          <SelectContent>
            {appointmentStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className='w-full md:w-[180px] border-gray-300'>
            <SelectValue placeholder='All Types' />
          </SelectTrigger>
          <SelectContent>
            {appointmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className='w-full md:w-[180px] border-gray-300'>
            <SelectValue placeholder='All Dates' />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* New Appointment Button (only on small screens) */}
        <div className='block md:hidden w-full'>
          <Button className='w-full bg-[#155FA0] hover:bg-[#0D4A87] text-white px-4 py-2 rounded-md'>
            <Plus className='mr-2' size={18} />
            New Appointment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentFilters
