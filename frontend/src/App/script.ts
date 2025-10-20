import { defineComponent } from 'vue'
import { usePlanStore } from '@/stores/plan'
import { mapActions } from 'pinia'

export default defineComponent({
  name: 'App',
  data() {
    return {
      theme: 'light',
      drawer: false
    }
  },
  methods: {
    ...mapActions(usePlanStore, [
      "clearCurrentPlan"
    ]),
    goHome() {
      this.$router.push('/')
    },
    goToNewPlan() {
      this.clearCurrentPlan()
      this.$router.push('/planning')
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      (this.$vuetify.theme.global as any).name = this.theme
    }
  }
})
