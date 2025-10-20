import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import { usePlanStore } from '@/stores/plan'

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      features: [
        {
          title: 'Smart Task Breakdown',
          description: 'Automatically decompose complex requirements into manageable, actionable tasks',
          icon: 'mdi-chart-tree',
          color: 'primary'
        },
        {
          title: 'Dependency Mapping',
          description: 'Visualize task relationships and dependencies with interactive graphs',
          icon: 'mdi-graph',
          color: 'success'
        },
        {
          title: 'AI-Powered Insights',
          description: 'Get intelligent suggestions and code snippets powered by LLM',
          icon: 'mdi-brain',
          color: 'purple'
        },
        {
          title: 'File Change Tracking',
          description: 'See exactly which files need to be created or modified for each task',
          icon: 'mdi-file-code',
          color: 'orange'
        },
        {
          title: 'Template Library',
          description: 'Start quickly with pre-built templates for common development patterns',
          icon: 'mdi-file-document-multiple',
          color: 'cyan'
        },
        {
          title: 'Progress Tracking',
          description: 'Monitor your project progress with visual indicators and metrics',
          icon: 'mdi-chart-line',
          color: 'teal'
        }
      ],
      steps: [
        {
          title: 'Describe',
          description: 'Write your requirements in plain language',
          color: 'primary'
        },
        {
          title: 'Analyze',
          description: 'AI breaks down into structured tasks',
          color: 'success'
        },
        {
          title: 'Plan',
          description: 'Review and refine the generated plan',
          color: 'purple'
        },
        {
          title: 'Execute',
          description: 'Follow the roadmap to completion',
          color: 'orange'
        }
      ]
    }
  },
  computed: {
    ...mapState(usePlanStore, ['plans']),
    recentPlans() {
      return this.plans.slice(0, 3)
    }
  },
  mounted() {
    usePlanStore().fetchPlans()
  },
  methods: {
    goToPlanning() {
      this.$router.push('/planning')
    },
    viewTemplates() {
      this.$router.push('/templates')
    },
    viewAllPlans() {
      this.$router.push('/plans')
    },
    openPlan(plan: any) {
      this.$router.push(`/planning/${plan.id}`)
    },
    getStatusColor(status: string): string {
      const colors: Record<string, string> = {
        draft: 'grey',
        active: 'primary',
        completed: 'success',
        archived: 'warning'
      }
      return colors[status] || 'grey'
    },
    getStatusIcon(status: string): string {
      const icons: Record<string, string> = {
        draft: 'mdi-file-outline',
        active: 'mdi-play-circle',
        completed: 'mdi-check-circle',
        archived: 'mdi-archive'
      }
      return icons[status] || 'mdi-file-outline'
    },
    getComplexityColor(complexity: string): string {
      const colors: Record<string, string> = {
        simple: 'success',
        moderate: 'warning',
        complex: 'error'
      }
      return colors[complexity] || 'grey'
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