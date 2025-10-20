import axios from 'axios'
import { defineStore } from 'pinia'
import type { Plan, Task, Template } from '@/types/plan'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001/api'

export const usePlanStore = defineStore('plan', {
  state: () => ({
    loading: false,
    plans: [] as Plan[],
    templates: [] as Template[],
    currentPlan: null as Plan | null,
    selectedTask: null as Task | null,
  }),
  getters: {
    getPlanById: state => (id: number) => {
      return state.plans.find(plan => plan.id === id)
    },
    activePlans: (state) => {
      return state.plans.filter(plan => plan.status === 'active')
    },
    draftPlans: (state) => {
      return state.plans.filter(plan => plan.status === 'draft')
    },
    completedPlans: (state) => {
      return state.plans.filter(plan => plan.status === 'completed')
    },
    currentPlanProgress: (state) => {
      if (!state.currentPlan) return 0
      const { totalTasks, completedTasks } = state.currentPlan.metadata
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    },
  },
  actions: {
    /**
     * Fetches all plans and sets the plans state
     * Sets loading and error state accordingly
     */
    async fetchPlans() {
      this.loading = true
      const response = await axios.get(`${API_URL}/plans`)
      this.plans = response.data
      this.loading = false
    },
    /**
     * Fetches a specific plan by id and sets it as currentPlan
     * Also syncs the plan inside the plans array
     */
    async fetchPlan(id: number | string) {
      this.loading = true
      const response = await axios.get(`${API_URL}/plans/${id}`)
      this.currentPlan = response.data
      const index = this.plans.findIndex(plan => plan.id === id)
      if (index >= 0) {
        this.plans[index] = response.data
      } else {
        this.plans.push(response.data)
      }
      this.loading = false
    },
    /**
     * Creates a new plan and sets it as the currentPlan
     * Prepends the new plan to the plans list
     */
    async createPlan(title: string, requirements: string, useAI = false) {
      this.loading = true
      const response = await axios.post(`${API_URL}/plans`, {
        title,
        requirements,
        useAI
      })
      const newPlan = response.data
      this.plans.unshift(newPlan)
      this.currentPlan = newPlan
      this.loading = false
      return newPlan
    },
    /**
     * Updates a plan by id with given partial updates
     * Syncs the plans list and currentPlan when applicable
     */
    async updatePlan(id: number | string, updates: Partial<Plan>) {
      this.loading = true
      const response = await axios.put(`${API_URL}/plans/${id}`, updates)
      const updatedPlan = response.data
      const index = this.plans.findIndex(plan => plan.id === id)
      if (index >= 0) {
        this.plans[index] = updatedPlan
      }
      if (this.currentPlan?.id === id) {
        this.currentPlan = updatedPlan
      }
      this.loading = false
      return updatedPlan
    },
    /**
     * Updates a single task inside a plan and syncs local state
     * Returns the updated plan from the backend
     */
    async updateTask(planId: number, taskId: number, updates: Partial<Task>) {
      this.loading = true
      const response = await axios.put(
        `${API_URL}/plans/${planId}/tasks/${taskId}`,
        updates
      )
      const updatedPlan = response.data
      const index = this.plans.findIndex(plan => plan.id === planId)
      if (index >= 0) {
        this.plans[index] = updatedPlan
      }
      if (this.currentPlan?.id === planId) {
        this.currentPlan = updatedPlan
      }
      this.loading = false
      return updatedPlan
    },
    /**
     * Deletes a plan by id and removes it from local state
     * Clears currentPlan if it was the one deleted
     */
    async deletePlan(id: number) {
      this.loading = true
      await axios.delete(`${API_URL}/plans/${id}`)
      this.plans = this.plans.filter(p => p.id !== id)
      if (this.currentPlan?.id === id) {
        this.currentPlan = null
      }
      this.loading = false
    },
    /**
     * Fetches available templates and sets the templates state
     */
    async fetchTemplates() {
      this.loading = true
      const response = await axios.get(`${API_URL}/templates`)
      this.templates = response.data
      this.loading = false
    },
    /**
     * Sends requirements to quick analysis endpoint
     * Returns analyzed data (not persisted as a plan)
     */
    async analyzeRequirements(requirements: string) {
      this.loading = true
      const response = await axios.post(`${API_URL}/analyze/quick`, {
        requirements
      })
      this.loading = false
      return response.data
    },
    /**
     * Sets the current plan in local state
     */
    setCurrentPlan(plan: Plan | null) {
      this.currentPlan = plan
    },
    /**
     * Sets the currently selected task in local state
     */
    setSelectedTask(task: Task | null) {
      this.selectedTask = task
    },
    /**
     * Clears local selections related to the current plan
     */
    clearCurrentPlan() {
      this.currentPlan = null
      this.selectedTask = null
    }
  }
})

