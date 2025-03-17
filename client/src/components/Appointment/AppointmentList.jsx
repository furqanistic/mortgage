import { Calendar, Clock, Eye, FileText, Trash2, User } from 'lucide-react'
import React from 'react'

const AppointmentList = ({
  view,
  sortedAppointments,
  getStatusStyles,
  getInitials,
  formatDate,
  formatTime,
  handleViewAppointment,
  handleDeleteClick,
}) => {
  return (
    <>
      {/* Desktop Table (List View) */}
      {view === 'list' && (
        <div className='hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-white-200'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-6 py-4 text-left text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Client
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Date & Time
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Application Date
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-[#155FA0] uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {sortedAppointments.length > 0 ? (
                  sortedAppointments.map((appointment) => {
                    const statusStyle = getStatusStyles(appointment.status)
                    const initials = getInitials(appointment.clientName)
                    return (
                      <tr
                        key={appointment.id}
                        className='hover:bg-gray-50 transition-colors cursor-pointer'
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div
                              className={`flex-shrink-0 h-10 w-10 rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center justify-center text-sm font-medium border ${statusStyle.border}`}
                            >
                              {initials}
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {appointment.clientName}
                              </div>
                              <div className='text-xs text-gray-500'>
                                {appointment.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <Calendar
                              size={16}
                              className='text-gray-400 mr-2'
                            />
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {formatDate(appointment.date)}
                              </div>
                              <div className='text-xs text-gray-500 flex items-center'>
                                <Clock size={12} className='mr-1' />
                                {formatTime(appointment.time)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {appointment.type}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-700'>
                            {formatDate(appointment.applicationDate)}
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.pill} ${statusStyle.pillText}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full bg-white opacity-70 mr-1.5`}
                            ></span>
                            {appointment.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                          <div
                            className='flex justify-center space-x-3'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className='text-[#51A0D0] hover:text-[#155FA0] cursor-pointer bg-[#EEF6FC] p-2 rounded-full transition-colors'
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewAppointment(appointment)
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className='text-red-500 hover:text-red-600 cursor-pointer bg-red-50 p-2 rounded-full transition-colors'
                              onClick={(e) =>
                                handleDeleteClick(appointment.id, e)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-10 text-center text-gray-500'
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View (placeholder) */}
      {view === 'calendar' && (
        <div className='hidden md:block bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
          <div className='text-center py-12 text-gray-500'>
            Calendar view is under development
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className='md:hidden space-y-4'>
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => {
            const statusStyle = getStatusStyles(appointment.status)
            const initials = getInitials(appointment.clientName)
            return (
              <div
                key={appointment.id}
                className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => handleViewAppointment(appointment)}
              >
                <div className='p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex items-center'>
                      <div
                        className={`h-12 w-12 rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center justify-center font-medium border ${statusStyle.border}`}
                      >
                        {initials}
                      </div>
                      <div className='ml-3'>
                        <div className='font-medium'>
                          {appointment.clientName}
                        </div>
                        <div className='text-xs text-gray-500 mt-0.5'>
                          {appointment.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.pill} ${statusStyle.pillText}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    <div className='flex items-start'>
                      <Calendar
                        size={16}
                        className='text-gray-400 mr-2 mt-0.5'
                      />
                      <div>
                        <div className='text-xs text-gray-500'>Date</div>
                        <div className='text-sm font-medium'>
                          {formatDate(appointment.date)}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <Clock size={16} className='text-gray-400 mr-2 mt-0.5' />
                      <div>
                        <div className='text-xs text-gray-500'>Time</div>
                        <div className='text-sm font-medium'>
                          {formatTime(appointment.time)}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <FileText
                        size={16}
                        className='text-gray-400 mr-2 mt-0.5'
                      />
                      <div>
                        <div className='text-xs text-gray-500'>Type</div>
                        <div className='text-sm font-medium'>
                          {appointment.type}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <User size={16} className='text-gray-400 mr-2 mt-0.5' />
                      <div>
                        <div className='text-xs text-gray-500'>
                          Application Date
                        </div>
                        <div className='text-sm font-medium'>
                          {formatDate(appointment.applicationDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end items-center pt-2 border-t border-gray-100 mt-2'>
                    <div className='flex space-x-2'>
                      <button
                        className='text-sm text-[#51A0D0] font-medium flex items-center bg-[#EEF6FC] px-3 py-1.5 rounded-lg cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewAppointment(appointment)
                        }}
                      >
                        <Eye size={16} className='mr-1' />
                        View
                      </button>
                      <button
                        className='text-sm text-red-500 font-medium flex items-center bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer'
                        onClick={(e) => handleDeleteClick(appointment.id, e)}
                      >
                        <Trash2 size={16} className='mr-1' />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className='bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm'>
            <div className='flex flex-col items-center py-6'>
              <Calendar className='text-gray-300 mb-2' size={48} />
              <p className='font-medium'>No appointments found</p>
              <p className='text-sm text-gray-400 mt-1'>
                Try adjusting your filters
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AppointmentList
