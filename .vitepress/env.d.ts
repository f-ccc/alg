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

declare module 'virtual:home-posts' {
  export interface HomePost {
    title: string
    link: string
    date: string
    cat: string
    color: string
  }
  export interface HomeCategory {
    slug: string
    name: string
    link: string
    count: number
    color: string
    icon: string
  }
  const data: { categories: HomeCategory[]; posts: HomePost[] }
  export default data
}
