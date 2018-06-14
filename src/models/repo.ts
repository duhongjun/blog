/**
 * 存储当前预览的todo
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IRepoState {
  repo: any
  readme: string
  events: any[]
}

const Repo = createModel({
  state: {
    repo: {},
    readme: '',
    events: []
  },
  reducers: {
    setRepo: (state: IRepoState, payload: any) => {
      return (state.repo = payload)
    },
    setReadme: (state: IRepoState, payload: string) => {
      return (state.readme = payload)
    },
    setEvents: (state: IRepoState, payload: any[]) => {
      return (state.events = payload)
    }
  },
  effects: {
    async getRepo(payload: string) {
      try {
        const { data = {} } = await github.get(`/repos/${CONFIG.owner}/${payload}`, {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json;charset=utf-8'
          }
        })
        dispatch.repo.getReadme(payload)
        dispatch.repo.getEvents(payload)
        dispatch.repo.setRepo(data)
      } catch (err) {
        console.error(err)
      }
    },
    async getReadme(payload: string) {
      try {
        const { data } = await github.get(`/repos/${CONFIG.owner}/${payload}/readme`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })
        dispatch.repo.setReadme(data)
      } catch (err) {
        console.error(err)
      }
    },
    async getEvents(payload: string) {
      try {
        const { data } = await github.get(`/repos/${CONFIG.owner}/${payload}/events`)
        dispatch.repo.setEvents(data)
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Repo
