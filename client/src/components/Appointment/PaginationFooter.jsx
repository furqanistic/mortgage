import React from 'react'

const PaginationFooter = ({ filteredCount, totalCount }) => {
  return (
    <div className='mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div className='text-sm text-gray-500'>
        Showing{' '}
        <span className='font-medium text-gray-700'>{filteredCount}</span> of{' '}
        <span className='font-medium text-gray-700'>{totalCount}</span>{' '}
        appointments
      </div>

      <div className='flex items-center space-x-2'>
        <button className='px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
          Previous
        </button>
        <div className='flex items-center space-x-1'>
          <button className='w-8 h-8 rounded-lg flex items-center justify-center bg-[#155FA0] text-white shadow-sm'>
            1
          </button>
          <button className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100'>
            2
          </button>
          <button className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100'>
            3
          </button>
        </div>
        <button className='px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white shadow-sm hover:bg-gray-50'>
          Next
        </button>
      </div>
    </div>
  )
}

export default PaginationFooter
