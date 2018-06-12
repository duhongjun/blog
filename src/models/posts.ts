/**
 * 存储帖子列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IPostState {
  posts: any[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}
interface IGetPosts {
  page: number
  perPage: number
  meta: any
}
interface ISetPosts {
  meta: {
    page: number
    perPage: number
    total: number
  }
  posts: any[]
}

const Posts = createModel({
  state: {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    },
    posts: []
  },
  reducers: {
    setPosts: (state: IPostState, payload: ISetPosts) => {
      state.posts = payload.posts
      state.meta = payload.meta
      return state
    }
  },
  effects: {
    async getPosts(payload: IGetPosts) {
      const { page, perPage } = payload.meta

      try {
        const res = await github.get(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues`, {
          params: { creator: CONFIG.owner, page, per_page: perPage, state: 'open' }
        })
        const posts = res.data
        const link = res.headers.link
        let newMeta = payload.meta
        /**
         * Pagination
         * # see detail https://developer.github.com/guides/traversing-with-pagination/
         */
        if (link) {
          const isLast = link.match(/<([^>]+)>(?=\;\s+rel="last")/)
          const lastPage = isLast ? isLast[1].match(/page=(\d+)/)[1] : page
          newMeta = {
            ...payload.meta,
            ...{ page, per_page: perPage, total: lastPage * perPage }
          }
        }
        posts.forEach((post: any) => {
          // 获取第一张图片作为缩略图
          const match = /!\[[^\]]+\]\(([^\)]+)\)/im.exec(post.body)
          if (match && match[1]) {
            post.thumbnails = match[1]
          }
        })
        dispatch.posts.setPosts({ posts, meta: newMeta })
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Posts
