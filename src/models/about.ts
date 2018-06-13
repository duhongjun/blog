/**
 * 存储帖子列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IAboutState {
  about: string
}
interface ISetAbout {
  about: string
}

const About = createModel({
  state: {
    about: ''
  },
  reducers: {
    storeAboutMe: (state: IAboutState, payload: ISetAbout) => {
      return (state.about = payload.about)
    }
  },
  effects: {
    async getAboutMe() {
      let html = ''
      try {
        const response = await github.get(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/ABOUTME.md`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })
        html = response.data
      } catch (err) {
        console.error(err)
      }
      dispatch.about.storeAboutMe(html)
    }
  }
})

export default About
