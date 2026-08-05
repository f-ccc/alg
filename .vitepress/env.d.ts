/// <reference types="vitepress/client" />

declare module 'virtual:search-index' {
  export interface SearchIndexPost {
    title: string
    desc: string
    text: string
    link: string
  }
  const index: SearchIndexPost[]
  export default index
}
