import { useRouter } from 'next/navigation'
import { createNavigationService, INavigationService } from '@/lib/navigation'

export const useNavigation = (): INavigationService => {
  const router = useRouter()
  return createNavigationService(router)
}