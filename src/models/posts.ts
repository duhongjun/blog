/**
 * 存储帖子列表
 */
import { createModel } from '@rematch/core'
export interface IPostState {
  posts: any[]
}

const Posts = createModel({
  state: {
    posts: []
  },
  reducers: {
    setPosts: (state: IPostState, payload: any[]) => state.posts.concat(payload)
  }
})

export default Posts
