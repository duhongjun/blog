/**
 * 存储repo列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface ITodoState {
  todo: any
}

const Todos = createModel({
  state: {
    todo: {}
  },
  reducers: {
    setTodo: (state: ITodoState, payload: any) => {
      return (state.todo = payload)
    }
  },
  effects: {
    async getTodo(payload: string) {
      try {
        const { data } = await github.get(`/repos/${CONFIG.owner}/${CONFIG.todo_repo}/issues/${payload}`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })
        dispatch.todo.setTodo(data)
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Todos
