import React, { useState } from 'react'
import AppointmentDetailPopup from './AppointmentDetailPopup'
import AppointmentFilters from './AppointmentFilters'
import AppointmentList from './AppointmentList'
import DeleteConfirmationPopup from './DeleteConfirmationPopup'
import PaginationFooter from './PaginationFooter'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Users as UsersIcon, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const AppointmentsTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)
  const [view, setView] = useState('list')

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: 'Markus Schmidt',
      date: '2025-03-18',
      time: '10:00',
      type: 'Initial Consultation',
      status: 'Confirmed',
      applicationDate: '2025-03-11',
      email: 'markus.schmidt@example.com',
      phone: '+49 123 456 7890',
      notes: 'First-time homebuyer looking for financing options for a property in Berlin.',
    },
    {
      id: 2,
      clientName: 'Emma Fischer',
      date: '2025-03-19',
      time: '14:30',
      type: 'Mortgage Options',
      status: 'Pending',
      applicationDate: '2025-03-12',
      email: 'emma.fischer@example.com',
      phone: '+49 234 567 8901',
      notes: 'Interested in refinancing current mortgage. Needs to discuss fixed-rate options.',
    },
    {
      id: 3,
      clientName: 'Leon Bauer',
      date: '2025-03-20',
      time: '11:15',
      type: 'Document Review',
      status: 'Confirmed',
      applicationDate: '2025-03-13',
      email: 'leon.bauer@example.com',
      phone: '+49 345 678 9012',
      notes: 'Submitted documents for review. Missing income verification paperwork.',
    },
    {
      id: 4,
      clientName: 'Sophie Wagner',
      date: '2025-03-22',
      time: '16:00',
      type: 'Property Valuation',
      status: 'Rescheduled',
      applicationDate: '2025-03-14',
      email: 'sophie.wagner@example.com',
      phone: '+49 456 789 0123',
      notes: 'Rescheduled from March 20th. Needs property valuation for investment property.',
    },
    {
      id: 5,
      clientName: 'David Hoffmann',
      date: '2025-03-24',
      time: '09:45',
      type: 'Final Approval',
      status: 'Confirmed',
      applicationDate: '2025-03-15',
      email: 'david.hoffmann@example.com',
      phone: '+49 567 890 1234',
      notes: 'Ready for final approval of mortgage application. All documents have been verified.',
    },
  ])

  const dateRanges = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' },
  ]

  const appointmentTypes = ['all', ...Array.from(new Set(appointments.map((a) => a.type)))]
  const appointmentStatuses = ['all', ...Array.from(new Set(appointments.map((a) => a.status)))]

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter

    let matchesDate = true
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    if (dateFilter === 'today') {
      matchesDate =
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === 'this-week') {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      matchesDate = appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
    } else if (dateFilter === 'this-month') {
      matchesDate = appointmentDate.getMonth() === today.getMonth() && appointmentDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === 'next-month') {
      const nextMonth = new Date(currentYear, currentMonth + 1)
      matchesDate = appointmentDate.getMonth() === nextMonth.getMonth() && appointmentDate.getFullYear() === today.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB
  })

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Confirmed': return { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' }
      case 'Pending': return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' }
      case 'Rescheduled': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' }
      case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
    }
  }

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('')

  const handleDeleteClick = (id, event) => {
    event.stopPropagation()
    event.preventDefault()
    setAppointmentToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter((a) => a.id !== appointmentToDelete))
      setIsDeleteConfirmOpen(false)
      setAppointmentToDelete(null)
    }
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailModalOpen(true)
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <section className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 font-heading sm:text-4xl'>Consultation Hub</h1>
          <p className='mt-2 text-slate-500 max-w-2xl'>Monitor, schedule, and refine client engagements through our integrated appointment management system.</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-white/80 backdrop-blur-md border border-white/50 p-2 rounded-2xl flex gap-1 shadow-sm'>
            <button 
              onClick={() => setView('list')}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold transition-all', view === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600')}
            >
              List View
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold transition-all', view === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600')}
            >
              Calendar
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
          { label: 'Upcoming Today', value: '12', icon: Clock, color: 'primary' },
          { label: 'Waitlist', value: '4', icon: UsersIcon, color: 'accent' },
          { label: 'Completion Rate', value: '94%', icon: CalendarIcon, color: 'slate' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className='rounded-[2.5rem] border border-white/40 bg-white/60 p-8 backdrop-blur-xl transition-all'
          >
            <div className='flex items-center gap-4'>
              <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center', stat.color === 'primary' ? 'bg-primary/10 text-primary' : stat.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500')}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>{stat.label}</p>
                <p className='text-2xl font-black text-slate-900 font-heading'>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <section className='relative rounded-[2.5rem] border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-2xl shadow-indigo-900/5 sm:p-10'>
        <AppointmentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          view={view}
          setView={setView}
          appointmentTypes={appointmentTypes}
          appointmentStatuses={appointmentStatuses}
          dateRanges={dateRanges}
        />

        <div className='mt-8'>
          <AppointmentList
            view={view}
            sortedAppointments={sortedAppointments}
            getStatusStyles={getStatusStyles}
            getInitials={getInitials}
            formatDate={formatDate}
            formatTime={formatTime}
            handleViewAppointment={handleViewAppointment}
            handleDeleteClick={handleDeleteClick}
          />
        </div>

        <div className='mt-8 pt-8 border-t border-slate-100'>
          <PaginationFooter
            filteredCount={filteredAppointments.length}
            totalCount={appointments.length}
          />
        </div>
      </section>

      <AppointmentDetailPopup
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
        getStatusStyles={getStatusStyles}
        formatDate={formatDate}
        formatTime={formatTime}
        getInitials={getInitials}
      />

      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onDelete={confirmDelete}
      />
    </div>
  )
}

export default AppointmentsTable
