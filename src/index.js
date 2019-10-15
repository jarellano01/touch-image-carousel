import { render } from 'react-dom'
import React, { useRef, useState } from 'react'
import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import './styles.css'
import Card from './card'

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())
function Viewpager() {
  const index = useRef(0)

  const [props, set] = useSprings(pages.length, i => ({
    x: i * window.innerWidth,
    scale: 1,
    display: 'block'
  }))

  const goToPage = ({ down, distance, mx, pageIndex }) => {
    set(i => {
      if (i < pageIndex - 1 || i > pageIndex + 1) return { display: 'none' }
      const x = (i - pageIndex) * window.innerWidth + (down ? mx : 0)
      const scale = down ? 1 - distance / window.innerWidth / 2 : 1
      return { x, scale, display: 'block' }
    })
  }
  const bind = useDrag(({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
    if (down && distance > window.innerWidth / 2)
      cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
    goToPage({ down, distance, mx, pageIndex: index.current })
  })

  const goToPageIndex = newCurrent => {
    index.current = newCurrent
    goToPage({ pageIndex: newCurrent })
  }

  return (
    <div>
      <button onClick={() => goToPageIndex(3)}>Test</button>
      {props.map(({ x, display, scale }, i) => (
        <animated.div {...bind()} key={i} style={{ display, x }} className="animated-container">
          <animated.div className="carousel-container">
            <animated.div className="carousel-content">
              <Card img={pages[i]} />
            </animated.div>
          </animated.div>
        </animated.div>
      ))}
    </div>
  )
}

render(<Viewpager />, document.getElementById('root'))
