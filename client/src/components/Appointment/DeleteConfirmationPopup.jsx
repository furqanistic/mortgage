import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, X } from 'lucide-react'
import React from 'react'

const DeleteConfirmationPopup = ({ isOpen, onClose, onDelete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md bg-white p-0 rounded-xl shadow-lg'>
        <div className='absolute right-4 top-4'>
          <button
            onClick={onClose}
            className='rounded-full p-1 text-gray-400 hover:bg-gray-100 cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>
        <DialogHeader className='p-5'>
          <div className='flex flex-col items-center text-center mb-2'>
            <div className='h-16 w-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4'>
              <Trash2 size={26} />
            </div>
            <DialogTitle className='text-xl font-bold text-gray-900'>
              Delete Appointment
            </DialogTitle>
          </div>
          <DialogDescription className='text-gray-600 mt-2 text-center'>
            Are you sure you want to delete this appointment? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='border-t border-gray-200 p-4 flex flex-col-reverse sm:flex-row sm:justify-center gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border border-gray-200 hover:bg-gray-50 cursor-pointer w-full sm:w-auto'
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onDelete}
            className='bg-red-500 hover:bg-red-600 cursor-pointer w-full sm:w-auto'
          >
            Delete Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationPopup
