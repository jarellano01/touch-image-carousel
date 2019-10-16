import React from 'react'
import { useSpring, animated, to } from 'react-spring'
import { useGesture } from 'react-use-gesture'

document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())

function Card({ img }) {
  const domTarget = React.useRef(null)
  const [{ x, y, zoom, scale }, set] = useSpring(() => ({
    scale: 1,
    zoom: 0,
    x: 0,
    y: 0,
    immediate: true
  }))

  const setPosition = ({ x, y }) => {
    const xSign = Math.sign(x)
    const newX = Math.abs(x) < window.innerWidth / 2 ? x : (window.innerWidth / 2) * xSign
    set({ x, y })
  }
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y], ...props }) => {
        console.log(props)
        setPosition({ x, y })
      },
      onPinch: ({ offset: [d, a] }) => set({ zoom: d / 200 })
    },
    { domTarget, event: { passive: false } }
  )
  const preventDragHandler = e => e.preventDefault()

  React.useEffect(bind, [bind])
  return (
    <animated.div
      ref={domTarget}
      className={`carousel-image`}
      style={{
        x,
        y,
        scale: to([scale, zoom], (s, z) => s + z)
      }}>
      <img className="carousel-image" src={img} alt="test" onDragStart={preventDragHandler} />
    </animated.div>
  )
}

export default Card
