import { defineComponent } from 'vue'
import { usePlanStore } from '@/stores/plan'
import type { Task, Template } from '@/types/plan'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  name: 'PlanningView',
  data() {
    return {
      requirements: '',
      planTitle: '',
      useAI: false,
      loading: false,
      viewMode: 'list' as 'list' | 'kanban' | 'graph',
      selectedTask: null as Task | null,
      showCompleteDialog: false,
      pendingStatus: null as string | null,
      statuses: [
        { label: 'Pending', value: 'pending', color: '#9e9e9e' },
        { label: 'In Progress', value: 'in_progress', color: '#2196f3' },
        { label: 'Completed', value: 'completed', color: '#4caf50' },
        { label: 'Blocked', value: 'blocked', color: '#f44336' }
      ],
      planStatuses: [
        { title: 'Draft', value: 'draft', icon: 'mdi-file-outline' },
        { title: 'Active', value: 'active', icon: 'mdi-play-circle' },
        { title: 'Completed', value: 'completed', icon: 'mdi-check-circle' },
        { title: 'Archived', value: 'archived', icon: 'mdi-archive' }
      ],
      quickTemplates: [
        { id: 'auth-system', name: 'Authentication System' },
        { id: 'crud-api', name: 'CRUD API' },
        { id: 'dashboard-ui', name: 'Dashboard UI' }
      ]
    }
  },
  computed: {
    ...mapState(usePlanStore, ['currentPlan']),
    sortedTasks(): Task[] {
      if (!this.currentPlan) return []
      return [...this.currentPlan.tasks].sort((first, second) => first.order - second.order)
    },
    planProgress(): number {
      if (!this.currentPlan) return 0
      const { totalTasks, completedTasks } = this.currentPlan.metadata
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    }
  },
  async mounted() {
    await usePlanStore().fetchTemplates()
    const planId = this.$route.params.id
    if (planId) {
      await usePlanStore().fetchPlan(planId as string)
      this.populateFormData()
    } else {
      this.clearFormData()
    }
  },
  methods: {
    ...mapActions(usePlanStore, [
      'fetchPlan',
      'createPlan',
      'updatePlan',
      'updateTask',
      'fetchTemplates',
      'clearCurrentPlan'
    ]),
    clearFormData() {
      this.requirements = ''
      this.planTitle = ''
      this.useAI = false
      this.loading = false
      this.selectedTask = null
      this.showCompleteDialog = false
      this.pendingStatus = null
      this.viewMode = 'list'
      this.clearCurrentPlan()
    },
    populateFormData() {
      if (this.currentPlan) {
        this.requirements = this.currentPlan.requirements
        this.planTitle = this.currentPlan.title
        this.useAI = false
      }
    },
    async generatePlan() {
      if (!this.requirements || !this.planTitle) return
      this.loading = true
      await this.createPlan(
        this.planTitle,
        this.requirements,
        this.useAI
      )
      this.loading = false
    },
    async loadTemplate(template: Template) {
      this.loading = true
      await this.fetchTemplates()
      const fullTemplate = usePlanStore().templates.find(temp => temp.id === template.id)
      if (fullTemplate) {
        this.requirements = fullTemplate.requirements
        this.planTitle = fullTemplate.name
      }
      this.loading = false
    },
    selectTask(task: Task) {
      this.selectedTask = task
    },
    async toggleTaskStatus(task: Task) {
      if (!this.currentPlan) return

      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      await this.updateTask(this.currentPlan.id, task.id, {
        status: newStatus
      })
    },
    async cycleTaskStatus() {
      if (!this.selectedTask || !this.currentPlan) return

      const statusCycle: Task['status'][] = ['pending', 'in_progress', 'completed', 'blocked']
      const currentIndex = statusCycle.indexOf(this.selectedTask.status)
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length]

      await this.updateTask(this.currentPlan.id, this.selectedTask.id, {
        status: nextStatus
      })

      this.selectedTask.status = nextStatus
    },
    async changeTaskStatus(newStatus: string) {
      if (!this.selectedTask || !this.currentPlan) return

      if (this.selectedTask.status === newStatus) return

      await this.updateTask(this.currentPlan.id, this.selectedTask.id, {
        status: newStatus as Task['status']
      })
      this.selectedTask.status = newStatus as Task['status']
    },
    getTasksByStatus(status: string): Task[] {
      if (!this.currentPlan) return []
      return this.currentPlan.tasks.filter(task => task.status === status)
    },
    getStatusColor(status: string): string {
      const colors: Record<string, string> = {
        pending: 'grey',
        in_progress: 'primary',
        completed: 'success',
        blocked: 'error'
      }
      return colors[status] || 'grey'
    },
    getPriorityColor(priority: string): string {
      const colors: Record<string, string> = {
        low: 'success',
        medium: 'primary',
        high: 'warning',
        critical: 'error'
      }
      return colors[priority]
    },
    getComplexityColor(complexity: string): string {
      const colors: Record<string, string> = {
        simple: 'success',
        moderate: 'warning',
        complex: 'error'
      }
      return colors[complexity]
    },
    getPlanStatusColor(status: string): string {
      const colors: Record<string, string> = {
        draft: 'grey',
        active: 'primary',
        completed: 'success',
        archived: 'warning'
      }
      return colors[status]
    },
    async changePlanStatus(newStatus: string) {
      if (!this.currentPlan) return

      if (this.currentPlan.status === newStatus) {
        return
      }
      if (newStatus === 'completed' && this.currentPlan.metadata.completedTasks < this.currentPlan.metadata.totalTasks) {
        this.pendingStatus = newStatus
        this.showCompleteDialog = true
        return
      }
      await this.updatePlan(this.currentPlan.id, {
        status: newStatus as 'draft' | 'active' | 'completed' | 'archived'
      })
    },
    async confirmComplete() {
      if (!this.currentPlan || !this.pendingStatus) return
      await this.updatePlan(this.currentPlan.id, {
        status: this.pendingStatus as 'draft' | 'active' | 'completed' | 'archived'
      })
      this.showCompleteDialog = false
      this.pendingStatus = null
    },
    getFileChangeIcon(action: string): string {
      const icons: Record<string, string> = {
        create: 'mdi-file-plus',
        modify: 'mdi-file-edit',
        delete: 'mdi-file-remove'
      }
      return icons[action]
    },
    getFileChangeColor(action: string): string {
      const colors: Record<string, string> = {
        create: 'success',
        modify: 'warning',
        delete: 'error'
      }
      return colors[action]
    }
  },
  watch: {
    async '$route'(to, from) {
      if (to.path === '/planning' && !to.params.id) {
        this.clearFormData()
      }
      else if (to.path.startsWith('/planning/') && to.params.id) {
        await this.fetchPlan(to.params.id as string)
        this.populateFormData()
      }
      else if (to.path === '/planning' && from.path !== '/planning') {
        this.clearFormData()
      }
    }
  }
})

