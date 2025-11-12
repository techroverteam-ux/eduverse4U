// Navigation utility following Single Responsibility Principle
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { errorHandler } from './error-handler'

export interface INavigationService {
  navigateTo(path: string): void
  navigateToSchools(): void
  navigateToAddSchool(): void
  navigateToSchoolSuccess(): void
  navigateToSchoolRegister(): void
  navigateToSuperAdminDashboard(): void
}

export class NavigationService implements INavigationService {
  constructor(private router: AppRouterInstance) {}

  navigateTo(path: string): void {
    try {
      this.router.push(path)
    } catch (error) {
      errorHandler.handleError(error as Error, `Navigation to ${path}`)
      // Fallback to window.location for critical navigation
      window.location.href = path
    }
  }

  navigateToSchools(): void {
    this.navigateTo('/super-admin/schools')
  }

  navigateToAddSchool(): void {
    this.navigateTo('/super-admin/schools/add')
  }

  navigateToSchoolSuccess(): void {
    this.navigateTo('/super-admin/schools/success')
  }

  navigateToSchoolRegister(): void {
    this.navigateTo('/schools/register')
  }

  navigateToSuperAdminDashboard(): void {
    this.navigateTo('/super-admin/dashboard')
  }
}

// Factory pattern for creating navigation service
export const createNavigationService = (router: AppRouterInstance): INavigationService => {
  return new NavigationService(router)
}