import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Clock3,
  FileText,
  Mail,
  Phone,
  User,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

const AppointmentDetailPopup = ({
  isOpen,
  onClose,
  appointment,
  formatDate,
  formatTime,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    appointment?.status || 'Pending'
  )
  const [isChanged, setIsChanged] = useState(false)

  // Available status options with icons and colors
  const statusOptions = [
    {
      value: 'Pending',
      icon: <Clock3 size={18} />,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      value: 'Confirmed',
      icon: <CheckCircle size={18} />,
      color: '#10B981',
      bg: '#D1FAE5',
    },
    {
      value: 'Rescheduled',
      icon: <AlertCircle size={18} />,
      color: '#6366F1',
      bg: '#E0E7FF',
    },
  ]

  // Get status details
  const getStatusDetails = (status) => {
    return (
      statusOptions.find((option) => option.value === status) ||
      statusOptions[0]
    )
  }

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus)
      setIsChanged(true)
    }
  }

  // Handle update button click
  const handleUpdate = () => {
    if (onUpdateStatus && appointment) {
      onUpdateStatus(appointment.id, selectedStatus)
    }
    setIsChanged(false)
  }

  if (!appointment) return null

  const currentStatusDetails = getStatusDetails(selectedStatus)

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white w-full max-w-2xl rounded-xl shadow-xl transition-all duration-300 overflow-hidden transform ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header with status indicator */}
        <div
          className={`relative px-6 py-4 transition-colors duration-300`}
          style={{
            backgroundColor: currentStatusDetails.bg,
            color: currentStatusDetails.color,
          }}
        >
          <div className='flex items-center'>
            {currentStatusDetails.icon}
            <span className='ml-2 font-semibold'>{selectedStatus}</span>
          </div>
          <h2 className='text-xl font-bold text-gray-800 mt-1'>
            Appointment Details
          </h2>

          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-white hover:bg-opacity-20 transition-colors'
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-4'>
          {/* Client section */}
          <div className='flex items-center mb-6 pb-6 border-b border-gray-100'>
            <div
              className='w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4'
              style={{ backgroundColor: '#155FA0' }}
            >
              {appointment.clientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <h3 className='text-lg font-bold'>{appointment.clientName}</h3>
              <div className='flex mt-1 text-sm text-gray-500'>
                <div className='flex items-center mr-4'>
                  <Mail size={14} className='mr-1' />
                  {appointment.email}
                </div>
                <div className='flex items-center'>
                  <Phone size={14} className='mr-1' />
                  {appointment.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment details */}
          <div className='grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100'>
            <div className='flex items-start'>
              <Calendar className='text-gray-400 mr-3 mt-0.5' size={18} />
              <div>
                <p className='text-xs text-gray-500'>Date</p>
                <p className='font-medium'>{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <Clock className='text-gray-400 mr-3 mt-0.5' size={18} />
              <div>
                <p className='text-xs text-gray-500'>Time</p>
                <p className='font-medium'>{formatTime(appointment.time)}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <FileText className='text-gray-400 mr-3 mt-0.5' size={18} />
              <div>
                <p className='text-xs text-gray-500'>Type</p>
                <p className='font-medium'>{appointment.type}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <User className='text-gray-400 mr-3 mt-0.5' size={18} />
              <div>
                <p className='text-xs text-gray-500'>Application Date</p>
                <p className='font-medium'>
                  {formatDate(appointment.applicationDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className='mb-6'>
              <h4 className='font-semibold text-gray-700 mb-2'>Notes</h4>
              <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Status switcher */}
          <div className='mb-6'>
            <h4 className='font-semibold text-gray-700 mb-3'>Update Status</h4>
            <div className='grid grid-cols-3 gap-3'>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    selectedStatus === option.value
                      ? `border-${option.value.toLowerCase()} bg-${option.value.toLowerCase()}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor:
                      selectedStatus === option.value ? option.color : '',
                    backgroundColor:
                      selectedStatus === option.value ? option.bg : '',
                  }}
                >
                  <div
                    className='w-8 h-8 rounded-full flex items-center justify-center mb-1'
                    style={{
                      color: option.color,
                      backgroundColor:
                        selectedStatus === option.value ? 'white' : option.bg,
                    }}
                  >
                    {option.icon}
                  </div>
                  <span
                    className='font-medium'
                    style={{
                      color:
                        selectedStatus === option.value ? option.color : 'gray',
                    }}
                  >
                    {option.value}
                  </span>

                  {selectedStatus === option.value && (
                    <div
                      className='absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white'
                      style={{ backgroundColor: option.color }}
                    ></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end bg-gray-50 px-6 py-4 border-t border-gray-100'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:text-gray-800 mr-2'
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={!isChanged}
            className={`px-6 py-2 rounded-lg text-white transition-all ${
              isChanged
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isChanged ? 'Update Status' : 'No Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetailPopup
