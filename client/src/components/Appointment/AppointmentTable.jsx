import React, { useState } from 'react'
import AppointmentDetailPopup from './AppointmentDetailPopup'
import AppointmentFilters from './AppointmentFilters'
import AppointmentList from './AppointmentList'
import DeleteConfirmationPopup from './DeleteConfirmationPopup'
import PaginationFooter from './PaginationFooter'

const AppointmentsTable = () => {
  // State definitions - all states must be declared here at the top
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'calendar'

  // Sample data for appointments
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
      notes:
        'First-time homebuyer looking for financing options for a property in Berlin.',
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
      notes:
        'Interested in refinancing current mortgage. Needs to discuss fixed-rate options.',
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
      notes:
        'Submitted documents for review. Missing income verification paperwork.',
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
      notes:
        'Rescheduled from March 20th. Needs property valuation for investment property.',
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
      notes:
        'Ready for final approval of mortgage application. All documents have been verified.',
    },
  ])

  // Date range options
  const dateRanges = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' },
  ]

  // Get unique appointment types - extracted from appointments data
  const appointmentTypes = [
    'all',
    ...Array.from(new Set(appointments.map((a) => a.type))),
  ]

  // Get unique statuses - extracted from appointments data
  const appointmentStatuses = [
    'all',
    ...Array.from(new Set(appointments.map((a) => a.status))),
  ]

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // Format time to AM/PM
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  // Filter appointments based on all criteria
  const filteredAppointments = appointments.filter((appointment) => {
    // Search term filter
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter

    // Type filter
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter

    // Date filter
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
      // Get start and end of current week
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      matchesDate =
        appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
    } else if (dateFilter === 'this-month') {
      matchesDate =
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === 'next-month') {
      const nextMonth = new Date(currentYear, currentMonth + 1)
      matchesDate =
        appointmentDate.getMonth() === nextMonth.getMonth() &&
        appointmentDate.getFullYear() === nextMonth.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB
  })

  // Status styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200',
          pill: 'bg-emerald-500',
          pillText: 'text-white',
        }
      case 'Pending':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          dot: 'bg-slate-500',
          border: 'border-slate-200',
          pill: 'bg-slate-500',
          pillText: 'text-white',
        }
      case 'Rescheduled':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          dot: 'bg-orange-500',
          border: 'border-orange-200',
          pill: 'bg-orange-500',
          pillText: 'text-white',
        }
      case 'Cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          dot: 'bg-red-500',
          border: 'border-red-200',
          pill: 'bg-red-500',
          pillText: 'text-white',
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          dot: 'bg-gray-500',
          border: 'border-gray-200',
          pill: 'bg-gray-500',
          pillText: 'text-white',
        }
    }
  }

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  // Delete button handler
  const handleDeleteClick = (id, event) => {
    // Prevent event bubbling (especially important in the mobile cards)
    event.stopPropagation()
    event.preventDefault()

    // Set the appointment ID to delete and open confirmation dialog
    setAppointmentToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  // Confirm deletion
  const confirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(
        appointments.filter(
          (appointment) => appointment.id !== appointmentToDelete
        )
      )
      setIsDeleteConfirmOpen(false)
      setAppointmentToDelete(null)
    }
  }

  // Open detail modal
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailModalOpen(true)
  }

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedAppointment(null)
  }

  return (
    <div className='w-full  p-6 rounded-xl'>
      {/* Filters Component */}
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

      {/* Appointment List Component */}
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

      {/* Pagination Footer Component */}
      <PaginationFooter
        filteredCount={filteredAppointments.length}
        totalCount={appointments.length}
      />

      {/* Popup Components */}
      <AppointmentDetailPopup
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
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
