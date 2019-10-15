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
    y: 0
  }))

  const [drag, setDrag] = React.useState(false)

  const setPosition = ({ x, y }) => {
    set({ x, y })
  }
  const bind = useGesture(
    {
      onDragStart: () => setDrag(true),
      onDrag: ({ offset: [x, y] }) => setPosition({ x, y }),
      onDragEnd: () => setDrag(false),
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
