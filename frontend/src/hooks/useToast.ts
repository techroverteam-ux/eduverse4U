"use client"

import { toast } from '@/components/ui/toast'

export interface SchoolToastMessages {
  schoolAdded: (schoolName: string) => void
  schoolUpdated: (schoolName: string) => void
  schoolDeleted: (schoolName: string) => void
  schoolStatusChanged: (schoolName: string, status: string) => void
  bulkAction: (action: string, count: number) => void
  exportComplete: (format: string, count: number) => void
  importComplete: (count: number, errors?: number) => void
  paymentProcessed: (schoolName: string, amount: number) => void
  subscriptionChanged: (schoolName: string, plan: string) => void
}

export const useSchoolToast = (): SchoolToastMessages => {
  return {
    schoolAdded: (schoolName: string) => {
      toast.success(
        'School Added Successfully!',
        `${schoolName} has been added to the platform and is ready to start their journey.`,
        {
          label: 'View School',
          onClick: () => {
            // Navigate to school details
            window.location.href = `/super-admin/schools`
          }
        }
      )
    },

    schoolUpdated: (schoolName: string) => {
      toast.success(
        'School Updated',
        `${schoolName} information has been successfully updated.`
      )
    },

    schoolDeleted: (schoolName: string) => {
      toast.success(
        'School Removed',
        `${schoolName} has been permanently removed from the platform.`
      )
    },

    schoolStatusChanged: (schoolName: string, status: string) => {
      const statusMessages = {
        'Active': `${schoolName} is now active and fully operational.`,
        'Inactive': `${schoolName} has been deactivated.`,
        'Trial': `${schoolName} is now on trial period.`,
        'Suspended': `${schoolName} has been suspended.`
      }

      const statusColors = {
        'Active': 'success',
        'Inactive': 'warning',
        'Trial': 'info',
        'Suspended': 'error'
      } as const

      const toastType = statusColors[status as keyof typeof statusColors] || 'info'
      
      if (toastType === 'success') {
        toast.success('Status Updated', statusMessages[status as keyof typeof statusMessages])
      } else if (toastType === 'error') {
        toast.error('Status Updated', statusMessages[status as keyof typeof statusMessages])
      } else if (toastType === 'warning') {
        toast.warning('Status Updated', statusMessages[status as keyof typeof statusMessages])
      } else {
        toast.info('Status Updated', statusMessages[status as keyof typeof statusMessages])
      }
    },

    bulkAction: (action: string, count: number) => {
      toast.success(
        'Bulk Action Completed',
        `${action} has been applied to ${count} school${count > 1 ? 's' : ''}.`
      )
    },

    exportComplete: (format: string, count: number) => {
      toast.success(
        'Export Completed',
        `${count} schools exported to ${format.toUpperCase()} format successfully.`,
        {
          label: 'Download',
          onClick: () => {
            // Trigger download
            toast.info('Download Started', 'Your file download has begun.')
          }
        }
      )
    },

    importComplete: (count: number, errors = 0) => {
      if (errors > 0) {
        toast.warning(
          'Import Completed with Warnings',
          `${count} schools imported successfully, ${errors} failed.`,
          {
            label: 'View Errors',
            onClick: () => {
              toast.info('Error Report', 'Opening detailed error report...')
            }
          }
        )
      } else {
        toast.success(
          'Import Successful',
          `${count} schools have been successfully imported to the platform.`
        )
      }
    },

    paymentProcessed: (schoolName: string, amount: number) => {
      toast.success(
        'Payment Processed',
        `₹${amount.toLocaleString()} payment from ${schoolName} has been processed successfully.`
      )
    },

    subscriptionChanged: (schoolName: string, plan: string) => {
      toast.success(
        'Subscription Updated',
        `${schoolName} has been upgraded to ${plan} plan.`,
        {
          label: 'View Details',
          onClick: () => {
            toast.info('Plan Details', `Viewing ${plan} plan features and benefits.`)
          }
        }
      )
    }
  }
}

// General purpose toast utilities
export const useToast = () => {
  const showLoadingToast = (message: string) => {
    return toast.loading('Processing...', message)
  }

  const showSuccessToast = (title: string, message?: string) => {
    toast.success(title, message)
  }

  const showErrorToast = (title: string, message?: string) => {
    toast.error(title, message)
  }

  const showWarningToast = (title: string, message?: string) => {
    toast.warning(title, message)
  }

  const showInfoToast = (title: string, message?: string) => {
    toast.info(title, message)
  }

  const showPromiseToast = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }

  return {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    showPromiseToast
  }
}