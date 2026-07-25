import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import CustomLayout from './components/CustomLayout.vue'
import StepViewer from './components/StepViewer.vue'
import HomePage from './components/HomePage.vue'
import HomeContent from './components/HomeContent.vue'
import AlgoNav from './components/AlgoNav.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('StepViewer', StepViewer)
    app.component('HomePage', HomePage)
    app.component('HomeContent', HomeContent)
    app.component('AlgoNav', AlgoNav)
  },
} satisfies Theme
