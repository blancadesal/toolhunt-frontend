export interface AuthState {
  user: User | null
  loading: boolean
}

export const useAuth = () => {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    loading: false,
  }))

  const isLoggedIn = computed(() => authState.value.user != null)

  const { fetchUserData, login, handleCallback, logout } = useToolhuntApi()

  const fetchUserDataAndUpdateState = async () => {
    authState.value.loading = true
    try {
      authState.value.user = await fetchUserData()
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      authState.value.user = null
    }
    finally {
      authState.value.loading = false
    }
  }

  const loginAndRedirect = () => {
    const currentRoute = useRoute()
    const currentPath = currentRoute.fullPath
    login(currentPath)
  }

  const handleCallbackAndUpdateState = async (code: string, state: string) => {
    try {
      const { user, redirectTo } = await handleCallback(code, state)
      authState.value.user = user
      return redirectTo
    }
    catch (error) {
      console.error('Error during login callback:', error)
      throw error
    }
  }

  const logoutAndUpdateState = async () => {
    try {
      await logout()
      authState.value.user = null
    }
    catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return {
    authState,
    isLoggedIn,
    fetchUserData: fetchUserDataAndUpdateState,
    logout: logoutAndUpdateState,
    login: loginAndRedirect,
    handleCallback: handleCallbackAndUpdateState,
  }
}
