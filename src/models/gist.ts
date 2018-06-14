/**
 * 存储gists列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'

interface IGistState {
  gist: any
  comments: any[]
}

const Gist = createModel({
  state: {
    gist: {},
    comments: []
  },
  reducers: {
    setGist: (state: IGistState, payload: any) => {
      state.gist = payload
      return state
    },
    setComments: (state: IGistState, payload: any[]) => {
      return (state.comments = payload)
    }
  },
  effects: {
    async getGist(payload: string) {
      try {
        const { data } = await github.get(`/gists/${payload}`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })

        for (const filename in data.files) {
          if (data.files.hasOwnProperty(filename)) {
            const file = data.files[filename]
            const res = await github.post(
              '/markdown',
              {
                text: '```' + file.language + '\n' + file.content + '\n```',
                mode: 'markdown'
              },
              { responseType: 'text' }
            )
            file.html = res.data
          }
        }
        dispatch.gist.getComments(payload)
        dispatch.gist.setGist(data)
      } catch (err) {
        console.error(err)
      }
    },
    async getComments(payload: string) {
      try {
        const { data } = await github.get(`/gists/${payload}/comments`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })

        dispatch.gist.setComments(data)
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Gist
