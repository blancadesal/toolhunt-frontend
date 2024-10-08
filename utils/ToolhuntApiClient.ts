// utils/ToolhuntApiClient.ts
import type { JSONSchemaType } from 'ajv'

export interface User {
  id: string
  username: string
  email: string
}

export interface Task {
  id: number
  field: string
  tool: {
    name: string
    title: string
    description: string
    url: string
  }
}

export interface AnnotationsSchema {
  schemas: Record<string, JSONSchemaType<{
    properties: Record<string, JSONSchemaType<unknown>>
  }>>
}

export interface ContributionData {
  rank: number
  username: string
  contributions: number
}

export interface ContributionsResponse {
  contributions: ContributionData[]
}

export interface ContributionsParams {
  days?: number
  limit?: number
}

export interface UserContribution {
  date: string
  tool_title: string
  field: string
}

export interface UserContributionsResponse {
  contributions: UserContribution[]
  total_contributions: number
}

export interface TaskSubmission {
  tool_name: string
  tool_title: string
  completed_date: string
  value: boolean | string | string[] // Can be boolean for reports, or string/string[] for regular tasks
  field: string // Optional field for report submissions
}

export interface ToolNamesResponse {
  all_titles: string[]
  titles: Record<string, string[]>
}

class ToolhuntApiClient {
  private apiBaseUrl: string

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl + '/api/v1'
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${this.apiBaseUrl}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return response
  }

  async fetchUserData(): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/user`, {
        credentials: 'include',
      })
      if (response.ok) {
        return await response.json()
      }
      else {
        console.error(`Failed to fetch user data: ${response.status}`)
        return null
      }
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  login(redirectPath: string): void {
    const loginUrl = `${this.apiBaseUrl}/auth/login?redirect_after=${encodeURIComponent(redirectPath)}`
    window.location.href = loginUrl
  }

  async handleCallback(code: string, state: string): Promise<{ user: User, redirectTo: string }> {
    const response = await fetch(`${this.apiBaseUrl}/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
      credentials: 'include',
    })
    if (response.ok) {
      const data = await response.json()
      return {
        user: data.user,
        redirectTo: data.redirect_to,
      }
    }
    else {
      throw new Error(`Login failed: ${response.status}`)
    }
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }
  }

  async fetchTasks(toolNames: string | null = null, fieldNames: string | null = null, limit: number = 5): Promise<Task[]> {
    const params = new URLSearchParams()
    if (toolNames) params.append('tool_names', toolNames)
    if (fieldNames) params.append('field_names', fieldNames)
    params.append('limit', limit.toString())

    const response = await this.fetchWithAuth(`/tasks?${params.toString()}`)
    return response.json()
  }

  async fetchFieldNames(): Promise<string[]> {
    const response = await this.fetchWithAuth('/fields')
    return response.json()
  }

  async fetchAnnotationsSchema(): Promise<AnnotationsSchema> {
    const response = await this.fetchWithAuth('/schema')
    return response.json()
  }

  async fetchContributions(params?: ContributionsParams): Promise<ContributionsResponse> {
    let url = '/user/contributions/leaderboard'
    if (params) {
      const queryParams = new URLSearchParams()
      if (params.days !== undefined) queryParams.append('days', params.days.toString())
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
      url += `?${queryParams.toString()}`
    }
    const response = await this.fetchWithAuth(url)
    return response.json()
  }

  async fetchUserContributions(username: string, limit?: number): Promise<UserContributionsResponse> {
    let url = `/user/contributions/${encodeURIComponent(username)}`
    if (limit !== undefined) {
      url += `?limit=${limit}`
    }
    const response = await this.fetchWithAuth(url)
    return response.json()
  }

  async fetchAllContributions(limit?: number): Promise<UserContributionsResponse> {
    let url = '/user/contributions'
    if (limit !== undefined) {
      url += `?limit=${limit}`
    }
    const response = await this.fetchWithAuth(url)
    return response.json()
  }

  async submitTask(taskId: number, submission: TaskSubmission): Promise<void> {
    const response = await this.fetchWithAuth(`/tasks/${taskId}`, {
      method: 'POST',
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to submit task')
    }
  }

  async fetchToolNames(): Promise<ToolNamesResponse> {
    const response = await this.fetchWithAuth('/tools')
    return response.json()
  }
}

export default ToolhuntApiClient
