import { defineComponent } from 'vue'
import { usePlanStore } from '@/stores/plan'
import type { Template } from '@/types/plan'

export default defineComponent({
  name: 'TemplatesView',
  data() {
    return {
      searchQuery: '',
      selectedCategory: null as string | null,
      showDialog: false,
      selectedTemplateDetails: null as Template | null
    }
  },
  computed: {
    planStore() {
      return usePlanStore()
    },
    categories(): string[] {
      const cats = new Set(this.planStore.templates.map(t => t.category))
      return Array.from(cats)
    },
    filteredTemplates(): Template[] {
      let templates = this.planStore.templates

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        templates = templates.filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
        )
      }
      if (this.selectedCategory) {
        templates = templates.filter(t => t.category === this.selectedCategory)
      }
      return templates
    }
  },
  async mounted() {
    await this.planStore.fetchTemplates()
  },
  methods: {
    getCategoryColor(category: string): string {
      const colors: Record<string, string> = {
        'Backend': 'primary',
        'Frontend': 'success',
        'Full Stack': 'purple'
      }
      return colors[category]
    },
    selectTemplate(template: Template) {
      this.selectedTemplateDetails = template
      this.showDialog = true
    },
    async useTemplate() {
      if (!this.selectedTemplateDetails) return

      const plan = await this.planStore.createPlan(
        this.selectedTemplateDetails.name,
        this.selectedTemplateDetails.requirements,
        false
      )

      this.showDialog = false
      this.$router.push(`/planning/${plan.id}`)
    }
  }
})