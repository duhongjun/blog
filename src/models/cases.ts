/**
 * 存储showcase列表
 */
import { dispatch, createModel } from '@rematch/core'
import github from 'src/common/github'
import CONFIG from 'src/config/config'

interface ICaseState {
  cases: any[]
  meta: {
    page: number
    perPage: number
    total: number
  }
}
interface IGetCase {
  page: number
  perPage: number
  meta: any
}
interface ISetCase {
  meta: {
    page: number
    perPage: number
    total: number
  }
  cases: any[]
}

/**
 * parse the data
 * @param d
 * @returns {{title, description: string, gallery: Array.<*>}}
 */
function dataParser(d: any) {
  const body = d.body

  const lines = body.split('\n')

  let homePageLine = -1
  let descriptionStartLineNumber = -1
  let descriptionEndLineNumber = -1
  let galleryStartLineNumber = -1
  let galleryEndLineNumber = -1

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim()
    if (line.indexOf(`<!-- homepage-start -->`) >= 0) {
      homePageLine = i + 1
    } else if (line.indexOf(`<!-- description-start -->`) >= 0) {
      descriptionStartLineNumber = i + 1
    } else if (line.indexOf(`<!-- description-end -->`) >= 0) {
      descriptionEndLineNumber = i - 1
    } else if (line.indexOf(`<!-- gallery-start -->`) >= 0) {
      galleryStartLineNumber = i + 1
    } else if (line.indexOf(`<!-- gallery-end -->`) >= 0) {
      galleryEndLineNumber = i - 1
    }
  }

  const description: any[] = []
  let gallery: any[] = []
  let homepage = ''

  body.split('\n').forEach((line: any, i: number) => {
    if (i === homePageLine) {
      homepage = line.trim()
    } else if (i >= descriptionStartLineNumber && i <= descriptionEndLineNumber) {
      description.push(line)
    } else if (i >= galleryStartLineNumber && i <= galleryEndLineNumber) {
      gallery.push(line)
    }
  })

  gallery = gallery.map(line => {
    const match = line.trim().match(/\[([^\]]+)\]\(([^)]+)\)/im)
    if (match) {
      const name = match[1]
      const url = match[2]
      return {
        name,
        url
      }
    } else {
      return void 0
    }
  })

  return {
    title: d.title,
    description: description.join('\n'),
    gallery: gallery.filter(v => v),
    screenshot: gallery.filter(v => v).map(v => v.url),
    labels: d.labels,
    homepage
  }
}

const Cases = createModel({
  state: {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    },
    cases: []
  },
  reducers: {
    setCases: (state: ICaseState, payload: ISetCase) => {
      state.cases = payload.cases
      state.meta = payload.meta
      return state
    }
  },
  effects: {
    async getCases(payload: IGetCase) {
      const { page, perPage } = payload.meta

      try {
        const { data, headers } = await github.get(`/repos/${CONFIG.owner}/showcase/issues`)
        const link = headers.link
        let newMeta = payload.meta
        const cases: any[] = []
        if (link) {
          const isLast = link.match(/<([^>]+)>(?=\;\s+rel="last")/)
          const lastPage = isLast ? isLast[1].match(/page=(\d+)/)[1] : page
          newMeta = {
            ...payload.meta,
            ...{ page, per_page: perPage, total: lastPage * perPage }
          }
        }
        data.forEach((c: any) => {
          cases.push(dataParser(c))
        })
        dispatch.cases.setCases({ cases, meta: newMeta })
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default Cases
