export function useToolhuntApi() {
  const config = useRuntimeConfig()
  const toolhuntApi = new ToolhuntApiClient(config.public.apiBase)

  const tasks = ref<Task[]>([])
  const fieldNames = ref<string[]>([])
  const annotationsSchema = ref<AnnotationsSchema | null>(null)
  const contributions = ref<ContributionsResponse | null>(null)
  const userContributions = ref<UserContributionsResponse>({ contributions: [], total_contributions: 0 })
  const error = ref<string | null>(null)
  const toolNames = ref<ToolNamesResponse | null>(null)

  const fetchTasks = async (toolNames: string | null = null, fieldNames: string | null = null): Promise<void> => {
    try {
      tasks.value = await toolhuntApi.fetchTasks(toolNames, fieldNames)
    }
    catch (error) {
      console.error('Error fetching tasks:', error)
      tasks.value = []
    }
  }

  const fetchFieldNames = async (): Promise<void> => {
    try {
      fieldNames.value = await toolhuntApi.fetchFieldNames()
    }
    catch (error) {
      console.error('Error fetching field names:', error)
      fieldNames.value = []
    }
  }

  const fetchAnnotationsSchema = async (): Promise<void> => {
    try {
      annotationsSchema.value = await toolhuntApi.fetchAnnotationsSchema()
    }
    catch (error) {
      console.error('Error fetching annotations schema:', error)
      annotationsSchema.value = null
    }
  }

  const fetchContributions = async (params?: ContributionsParams): Promise<void> => {
    try {
      contributions.value = await toolhuntApi.fetchContributions(params)
    }
    catch (error) {
      console.error('Error fetching contributions:', error)
      contributions.value = null
    }
  }

  const fetchUserContributions = async (username: string, limit?: number): Promise<void> => {
    error.value = null
    try {
      userContributions.value = await toolhuntApi.fetchUserContributions(username, limit)
    }
    catch (err) {
      console.error('Error fetching user contributions:', err)
      error.value = err instanceof Error ? err.message : String(err)
      userContributions.value = { contributions: [], total_contributions: 0 }
    }
  }

  const fetchToolNames = async (): Promise<void> => {
    try {
      toolNames.value = await toolhuntApi.fetchToolNames()
    }
    catch (error) {
      console.error('Error fetching tool names:', error)
      toolNames.value = null
    }
  }

  const submitTask = async (taskId: number, submission: TaskSubmission): Promise<void> => {
    try {
      console.log('Submitting task with ID:', taskId)
      console.log('Submission data:', JSON.stringify(submission, null, 2))
      await toolhuntApi.submitTask(taskId, submission)
    }
    catch (error) {
      console.error('Error submitting task:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      throw error
    }
  }

  const fetchUserData = async (): Promise<User | null> => {
    try {
      return await toolhuntApi.fetchUserData()
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  return {
    tasks,
    fieldNames,
    annotationsSchema,
    fetchTasks,
    fetchFieldNames,
    fetchAnnotationsSchema,
    contributions,
    fetchContributions,
    userContributions,
    fetchUserContributions,
    error,
    submitTask,
    toolNames,
    fetchToolNames,
    fetchUserData,
    login: toolhuntApi.login.bind(toolhuntApi),
    handleCallback: toolhuntApi.handleCallback.bind(toolhuntApi),
    logout: toolhuntApi.logout.bind(toolhuntApi),
  }
}
