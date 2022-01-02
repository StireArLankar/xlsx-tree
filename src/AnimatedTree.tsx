/* eslint-disable jsx-a11y/accessible-emoji */
import React, { memo, useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import * as Icons from './icons'
import classes from './styles'

type Base = {
  meta?: boolean
  title: string
}

export type Data = Base &
  (
    | {
        type: 'branch'
        nodes: Data[]
      }
    | {
        type: 'leaf'
        title: string
      }
  )

type TreeProps = Data & {
  style?: React.CSSProperties
  defaultOpen?: boolean
}

const getIcon = (hasNodes: boolean, isOpen?: boolean) => {
  if (!hasNodes) {
    return Icons.CloseSquareO
  }

  return isOpen ? Icons.MinusSquareO : Icons.PlusSquareO
}

const trans = (val: any) => `translate3d(${20 - 20 * val}px,0,0)`

export const Tree = memo((props: TreeProps) => {
  const { style, defaultOpen = false } = props

  const [isOpen, setOpen] = useState(defaultOpen)
  const toggle = () => setOpen((prev) => !prev)

  const previous = usePrevious(isOpen)

  const [ref, { height: viewHeight }] = useMeasure()

  const { height, opacity } = useSpring({
    height: isOpen ? viewHeight : 0,
    opacity: isOpen ? 1 : 0,
  })

  const canExpand = props.type === 'branch' && props.nodes.length > 0

  const Icon = getIcon(canExpand, isOpen)

  return (
    <div className={classes.frame()}>
      <div
        onClick={canExpand ? toggle : undefined}
        style={{
          cursor: props.type === 'branch' ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          willChange: 'transform',
          gap: 4,
        }}
      >
        {props.type === 'leaf' ? <Table /> : <Icon className={classes.toggle()} />}
        {props.type === 'leaf' && <Table />}
        {props.type === 'leaf' && <Table />}
        <span className={classes.title()} style={style}>
          {props.title}
        </span>
        {props.meta ? <M /> : null}
      </div>

      <animated.div
        className={classes.content()}
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <animated.div style={{ transform: opacity.to(trans) }} ref={ref}>
          {props.type === 'branch'
            ? props.nodes.map((node) => <Tree {...node} key={node.title} />)
            : null}
        </animated.div>
      </animated.div>
    </div>
  )
})

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value)

  useEffect(() => void (ref.current = value), [value])

  return ref.current
}

const M = () => (
  <svg viewBox='0 0 24 24' width={16}>
    <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
  </svg>
)
const Table = () => (
  <svg viewBox='0 0 24 24' width={16}>
    <path d='M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z' />
  </svg>
)
