import { defineComponent } from 'vue'
import { usePlanStore } from '@/stores/plan'
import type { Plan } from '@/types/plan'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  name: 'PlansView',
  data() {
    return {
      searchQuery: '',
      filterStatus: null as string | null,
      sortBy: 'date-desc',
      showDeleteDialog: false,
      planToDelete: null as Plan | null,
      statusOptions: [
        { title: 'Draft', value: 'draft' },
        { title: 'Active', value: 'active' },
        { title: 'Completed', value: 'completed' },
        { title: 'Archived', value: 'archived' }
      ],
      sortOptions: [
        { title: 'Newest First', value: 'date-desc' },
        { title: 'Oldest First', value: 'date-asc' },
        { title: 'Name A-Z', value: 'name-asc' },
        { title: 'Name Z-A', value: 'name-desc' },
        { title: 'Progress', value: 'progress' }
      ]
    }
  },
  computed: {
    ...mapState(usePlanStore, ['plans', 'loading']),
    filteredPlans(): Plan[] {
      let plans = [...this.plans]
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        plans = plans.filter(plan =>
          plan.title.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query) ||
          plan.requirements.toLowerCase().includes(query)
        )
      }
      if (this.filterStatus) {
        plans = plans.filter(plan => plan.status === this.filterStatus)
      }
      switch (this.sortBy) {
        case 'date-desc':
          plans.sort((plan1, plan2) => new Date(plan2.createdAt).getTime() - new Date(plan1.createdAt).getTime())
          break
        case 'date-asc':
          plans.sort((plan1, plan2) => new Date(plan1.createdAt).getTime() - new Date(plan2.createdAt).getTime())
          break
        case 'name-asc':
          plans.sort((plan1, plan2) => plan1.title.localeCompare(plan2.title))
          break
        case 'name-desc':
          plans.sort((plan1, plan2) => plan2.title.localeCompare(plan1.title))
          break
        case 'progress':
          plans.sort((plan1, plan2) => {
            const progressA = (plan1.metadata.completedTasks / plan1.metadata.totalTasks) * 100
            const progressB = (plan2.metadata.completedTasks / plan2.metadata.totalTasks) * 100
            return progressA - progressB
          })
          break
      }
      return plans
    }
  },
  async mounted() {
    await usePlanStore().fetchPlans()
  },
  methods: {
    ...mapActions(usePlanStore, ['createPlan', 'deletePlan']),
    createNewPlan() {
      this.$router.push('/planning')
    },

    openPlan(plan: Plan) {
      this.$router.push(`/planning/${plan.id}`)
    },
    async duplicatePlan(plan: Plan) {
      await this.createPlan(
        `${plan.title} (Copy)`,
        plan.requirements,
        false
      )
    },
    showDeleteConfirmation(plan: Plan) {
      this.planToDelete = plan
      this.showDeleteDialog = true
    },
    async confirmDelete() {
      if (!this.planToDelete) return

      await this.deletePlan(this.planToDelete.id)
      this.showDeleteDialog = false
      this.planToDelete = null
    },
    getPlanProgress(plan: Plan): number {
      const { totalTasks, completedTasks } = plan.metadata
      return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    },
    getStatusColor(status: string): string {
      const colors: Record<string, string> = {
        draft: 'grey',
        active: 'primary',
        completed: 'success',
        archived: 'warning'
      }
      return colors[status]
    },
    getStatusIcon(status: string): string {
      const icons: Record<string, string> = {
        draft: 'mdi-file-outline',
        active: 'mdi-play-circle',
        completed: 'mdi-check-circle',
        archived: 'mdi-archive'
      }
      return icons[status]
    },
    getComplexityColor(complexity: string): string {
      const colors: Record<string, string> = {
        simple: 'success',
        moderate: 'warning',
        complex: 'error'
      }
      return colors[complexity]
    },
    formatDate(date: Date): string {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }
})

