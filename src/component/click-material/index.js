import React, { Component } from 'react'
import anime from 'animejs'
import { ClickColors } from '../../common/constant'
import './index.css'

const numberOfParticules = 40
const tap = 'ontouchstart' in window || navigator.msMaxTouchPoints ? 'touchstart' : 'mousedown'

class ClickComponents extends Component {
  setCanvasSize = (height = document.body.scrollHeight) => {
    this.canvasEl.width = document.body.scrollWidth * 2
    this.canvasEl.height = height * 2
    this.canvasEl.style.width = '100%'
    this.canvasEl.style.height = height + 'px'
    this.canvasEl.getContext('2d').scale(2, 2)
  }

  updateCoords = e => {
    this.pointerX = e.pageX || e.touches[0].pageX
    this.pointerY = e.pageY || e.touches[0].pageY
  }

  setParticuleDirection(p) {
    const angle = anime.random(0, 360) * Math.PI / 180
    const value = anime.random(50, 180)
    const radius = [-1, 1][anime.random(0, 1)] * value
    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle)
    }
  }

  createParticule = (x, y) => {
    const p = {}
    p.x = x
    p.y = y
    p.color = ClickColors[anime.random(0, ClickColors.length - 1)]
    p.radius = anime.random(16, 32)
    p.endPos = this.setParticuleDirection(p)
    p.draw = () => {
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      this.ctx.fillStyle = p.color
      this.ctx.fill()
    }
    return p
  }

  createCircle = (x, y) => {
    const p = {}
    p.x = x
    p.y = y
    p.color = '#FFF'
    p.radius = 0.1
    p.alpha = 0.5
    p.lineWidth = 6
    p.draw = () => {
      this.ctx.globalAlpha = p.alpha
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      this.ctx.lineWidth = p.lineWidth
      this.ctx.strokeStyle = p.color
      this.ctx.stroke()
      this.ctx.globalAlpha = 1
    }
    return p
  }

  renderParticule(anim) {
    anim.animatables.forEach(item => {
      item.target.draw()
    })
  }

  animateParticules = (x, y) => {
    const circle = this.createCircle(x, y)
    const particules = []
    for (let i = 0; i < numberOfParticules; i++) {
      particules.push(this.createParticule(x, y))
    }
    anime
      .timeline()
      .add({
        targets: particules,
        x: function(p) {
          return p.endPos.x
        },
        y: function(p) {
          return p.endPos.y
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: this.renderParticule
      })
      .add({
        targets: circle,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
          value: 0,
          easing: 'linear',
          duration: anime.random(600, 800)
        },
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: this.renderParticule,
        offset: 0
      })
  }

  render() {
    return (
      <canvas
        className="fireworks"
        height="100%"
        ref={el => {
          this.canvasEl = el
        }}
      />
    )
  }

  componentDidMount() {
    this.pointerX = 0
    this.pointerY = 0
    this.ctx = this.canvasEl.getContext('2d')

    const render = anime({
      duration: Infinity,
      update: () => {
        this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
      }
    })
    this.setCanvasSize()
    document.addEventListener(
      tap,
      e => {
        const scrollHeight = document.body.scrollHeight
        if (scrollHeight !== this.scrollHeight) {
          this.setCanvasSize(scrollHeight)
        }
        render.play()
        this.updateCoords(e)
        this.animateParticules(this.pointerX, this.pointerY)
      },
      false
    )

    window.addEventListener('resize', this.setCanvasSize, false)
  }
}

export default ClickComponents
