import { Calendar, Clock, Eye, FileText, Trash2, User, MoreVertical } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full border-separate border-spacing-y-3'>
            <thead>
              <tr className='text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400'>
                <th className='px-6 pb-2'>Client Context</th>
                <th className='px-6 pb-2'>Schedule</th>
                <th className='px-6 pb-2'>Service Type</th>
                <th className='px-6 pb-2'>Status</th>
                <th className='px-6 pb-2 text-right'>Management</th>
              </tr>
            </thead>
            <tbody className='space-y-4'>
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment) => {
                  const statusStyle = getStatusStyles(appointment.status)
                  const initials = getInitials(appointment.clientName)
                  return (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={appointment.id}
                      className='group cursor-pointer'
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      <td className='rounded-l-[2rem] bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-l border-slate-100'>
                        <div className='flex items-center gap-4'>
                          <div className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold border shadow-sm transition-all group-hover:shadow-md',
                            statusStyle.bg, statusStyle.text, "border-slate-100"
                          )}>
                            {initials}
                          </div>
                          <div className='flex flex-col'>
                            <span className='font-bold text-slate-900 group-hover:text-primary transition-colors'>{appointment.clientName}</span>
                            <span className='text-[11px] text-slate-400 font-medium'>{appointment.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-2 text-xs font-bold text-slate-900'>
                            <Calendar size={14} className='text-primary opacity-60' />
                            {formatDate(appointment.date)}
                          </div>
                          <div className='flex items-center gap-2 text-[10px] text-slate-400 font-bold'>
                            <Clock size={12} className='opacity-60' />
                            {formatTime(appointment.time)}
                          </div>
                        </div>
                      </td>
                      <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                        <span className='inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 capitalize'>
                          <FileText size={14} className='opacity-40' />
                          {appointment.type}
                        </span>
                      </td>
                      <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                        <div className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border',
                          statusStyle.bg, statusStyle.text, "border-slate-200/50"
                        )}>
                          <div className={cn('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
                          {appointment.status}
                        </div>
                      </td>
                      <td className='rounded-r-[2rem] bg-white p-6 text-right transition-colors group-hover:bg-slate-50/50 border-y border-r border-slate-100'>
                        <div className='flex items-center justify-end gap-2'>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); handleViewAppointment(appointment); }}
                            className='flex h-11 px-4 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all'
                          >
                            Review
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDeleteClick(appointment.id, e)}
                            className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100'
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className='px-6 py-20 text-center rounded-[2.5rem] bg-white/50 border border-dashed border-slate-200'>
                    <div className='flex flex-col items-center gap-3 opacity-30'>
                      <Calendar size={48} />
                      <p className='font-bold'>No scheduled appointments discovered</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View (Placeholder Styling) */}
      {view === 'calendar' && (
        <div className='hidden md:block bg-white/40 backdrop-blur-md rounded-[2.5rem] p-12 border border-white/50 border-dashed text-center'>
          <Calendar size={48} className='mx-auto mb-4 text-slate-300' />
          <h3 className='text-lg font-bold text-slate-900 font-heading'>Calendar Orchestrator</h3>
          <p className='text-sm text-slate-500 mt-2'>The visual scheduling engine is reaching final stages of development.</p>
        </div>
      )}

      {/* Mobile Cards */}
      <div className='md:hidden space-y-4'>
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => {
            const statusStyle = getStatusStyles(appointment.status)
            const initials = getInitials(appointment.clientName)
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                key={appointment.id}
                className='bg-white/80 backdrop-blur-md rounded-[2rem] border border-white p-6 shadow-xl shadow-black/5 cursor-pointer'
                onClick={() => handleViewAppointment(appointment)}
              >
                <div className='flex justify-between items-start mb-6'>
                  <div className='flex items-center gap-4'>
                    <div className={cn('h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg border border-slate-50 shadow-sm', statusStyle.bg, statusStyle.text)}>
                      {initials}
                    </div>
                    <div>
                      <h4 className='font-bold text-slate-900 leading-tight'>{appointment.clientName}</h4>
                      <p className='text-xs text-slate-400 mt-1'>{appointment.email}</p>
                    </div>
                  </div>
                  <div className={cn('px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', statusStyle.bg, statusStyle.text, "border-slate-200/50")}>
                    {appointment.status}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-y-4 gap-x-2 mb-6'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-bold'>Date</span>
                    <span className='text-sm font-bold text-slate-700 flex items-center gap-1.5'><Calendar size={14} className='text-primary opacity-50'/> {formatDate(appointment.date)}</span>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-bold'>Time</span>
                    <span className='text-sm font-bold text-slate-700 flex items-center gap-1.5'><Clock size={14} className='text-primary opacity-50'/> {formatTime(appointment.time)}</span>
                  </div>
                  <div className='flex flex-col gap-1 col-span-2'>
                    <span className='text-[10px] uppercase tracking-widest text-slate-400 font-bold'>Session</span>
                    <span className='text-sm font-bold text-slate-700 flex items-center gap-1.5'><FileText size={14} className='text-primary opacity-50'/> {appointment.type}</span>
                  </div>
                </div>

                <div className='flex gap-2 pt-4 border-t border-slate-50'>
                   <button className='flex-1 py-3 items-center justify-center rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20'>
                    Open Details
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(appointment.id, e); }}
                    className='h-11 w-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100'
                   >
                    <Trash2 size={18} />
                   </button>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className='bg-white/40 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center'>
            <Calendar className='mx-auto mb-3 text-slate-300' size={40} />
            <p className='text-sm font-bold text-slate-400'>No results found</p>
          </div>
        )}
      </div>
    </>
  )
}

export default AppointmentList
