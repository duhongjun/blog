/**
 * 存储repo列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IRepoState {
  repos: any[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}
interface IGetRepos {
  page: number
  perPage: number
  meta: any
}
interface ISetRepos {
  meta: {
    page: number
    perPage: number
    total: number
  }
  repos: any[]
}

const Repos = createModel({
  state: {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    },
    repos: []
  },
  reducers: {
    setRepos: (state: IRepoState, payload: ISetRepos) => {
      state.repos = payload.repos
      state.meta = payload.meta
      return state
    }
  },
  effects: {
    async getRepos(payload: IGetRepos) {
      const { page, perPage } = payload.meta

      try {
        const res = await github.get(`/users/${CONFIG.owner}/repos?sort=created`, {
          params: { page, per_page: perPage },
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8'
          }
        })
        const repos = res.data
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
        dispatch.repos.setRepos({ repos, meta: newMeta })
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Repos
