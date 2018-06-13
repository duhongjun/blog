/**
 * 存储gists列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IGistState {
  gists: any[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}
interface IGetGists {
  page: number
  perPage: number
  meta: any
}
interface ISetGists {
  meta: {
    page: number
    perPage: number
    total: number
  }
  gists: any[]
}

const Gists = createModel({
  state: {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    },
    gists: []
  },
  reducers: {
    setGists: (state: IGistState, payload: ISetGists) => {
      state.gists = payload.gists
      state.meta = payload.meta
      return state
    }
  },
  effects: {
    async getGists(payload: IGetGists) {
      const { page, perPage } = payload.meta

      try {
        const res = await github.get(`/users/${CONFIG.owner}/gists`, {
          params: { page, per_page: perPage }
        })
        const gists = res.data
        const link = res.headers.link
        let newMeta = payload.meta
        if (link) {
          const isLast = link.match(/<([^>]+)>(?=\;\s+rel="last")/)
          const lastPage = isLast ? isLast[1].match(/page=(\d+)/)[1] : page
          newMeta = {
            ...payload.meta,
            ...{ page, per_page: perPage, total: lastPage * perPage }
          }
        }
        dispatch.gists.setGists({ gists, meta: newMeta })
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Gists
