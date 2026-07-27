import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import CustomLayout from './components/CustomLayout.vue'
import StepViewer from './components/StepViewer.vue'
import HomeContent from './components/HomeContent.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('StepViewer', StepViewer)
    app.component('HomeContent', HomeContent)
  },
} satisfies Theme
