/**
 * 当前帖子
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface IPostState {
  post: any
  comments: any[]
}
interface ISimpleObj {
  [key: string]: any
}

// function htmlFilter(html: ) {
//   // 提取第一张图片作为封面
//   let $div = document.createElement('div')
//   $div.innerHTML = html
//   let $banner = $div.querySelector('img[alt=banner]')

//   // 如果存在banner，则删除该行的ｐ标签
//   if ($banner) {
//     if ($banner.src) {
//       this.setState({ banner: $banner.src })
//     }
//     const $parent = $banner.parentElement
//     if ($parent && $parent.tagName === 'A') {
//       if ($parent.parentNode && $parent.parentElement.tagName === 'P') {
//         $parent.parentElement.remove()
//       } else {
//         $parent.remove()
//       }
//     } else {
//       $banner.remove()
//     }
//   }
//   return $div.innerHTML
// }

const Post = createModel({
  state: {
    post: {},
    comments: []
  },
  reducers: {
    setPost: (state: IPostState, payload: any) => {
      return (state.post = payload)
    },
    setComments: (state: IPostState, payload: any[]) => {
      return (state.comments = payload)
    }
  },
  effects: {
    async getPost(payload: number) {
      let post: ISimpleObj = {}
      try {
        const { data } = await github.get(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${payload}`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })
        post = data
        // post.filter_html = htmlFilter(data.body_html)
        post.filter_html = data.body_html
      } catch (err) {
        console.error(err)
      }
      dispatch.post.setPost(post)
    },
    async getIssuesComments(payload: number) {
      try {
        const { data } = await github.get(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${payload}/comments`, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          responseType: 'text'
        })
        dispatch.post.setComments(data)
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Post
