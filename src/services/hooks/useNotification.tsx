import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type ToastProps = {
  title?: string
  message?: string
  to?: string
}

export const useNotification = () => {
  const router = useRouter()
  const MySwal = withReactContent(Swal)

  const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 2000,
    timerProgressBar: true,
    width: '24rem',
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  const success = async (toast?: ToastProps) => {
    await Toast.fire({
      icon: 'success',
      title: toast?.title,
      text: toast?.message,
      didRender: () => {
        toast?.to && router.push(toast?.to)
      },
    })
  }

  const error = async (toast?: ToastProps) => {
    await Toast.fire({
      icon: 'error',
      title: 'Oops...Something went wrong!',
      text: toast?.message ?? '',
    })
  }

  return {
    success,
    error,
  }
}
