/**
 * 存储repo列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface ITodoState {
  todos: any[]
  labels: any[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}

interface ISetTodos {
  meta: {
    page: number
    perPage: number
    total: number
  }
  todos: any[]
}

interface IGetTodos {
  page: number
  perPage: number
  meta: any
}

const Todos = createModel({
  state: {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    },
    todos: [],
    labels: []
  },
  reducers: {
    setTodos: (state: ITodoState, payload: ISetTodos) => {
      state.todos = payload.todos
      state.meta = payload.meta
      return state
    },
    setLabel: (state: ITodoState, payload: any[]) => {
      return (state.labels = payload)
    }
  },
  effects: {
    async getAllTodos(payload: IGetTodos) {
      const { page, perPage } = payload.meta
      try {
        const res = await github.get(`/repos/${CONFIG.owner}/${CONFIG.todo_repo}/issues`, {
          params: { creator: CONFIG.owner, page, per_page: perPage, state: 'all' }
        })
        const todos = res.data
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
        dispatch.todos.setTodos({ todos, meta: newMeta })
      } catch (err) {
        console.error(err)
      }
    },
    async getLabels() {
      const { data } = await github.get(`/repos/${CONFIG.owner}/${CONFIG.todo_repo}/labels`)
      dispatch.todos.setLabel(data)
    }
  }
})

export default Todos
