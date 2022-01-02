/* eslint-disable jsx-a11y/accessible-emoji */
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
} from '@chakra-ui/react'

import React, { memo } from 'react'
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

export const Tree = memo((props: TreeProps) => {
  const { style } = props

  if (props.type === 'branch') {
    return (
      <Accordion defaultIndex={[]} allowMultiple>
        <AccordionItem>
          <AccordionButton
            css={{
              padding: 5,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
            }}
          >
            <AccordionIcon
              css={{
                marginLeft: '-4px',
                marginRight: 8,
              }}
            />
            {props.title}
          </AccordionButton>
          <AccordionPanel pb={4}>
            <div className={classes.content()}>
              {props.nodes.map((node) => (
                <Tree {...node} key={node.title} />
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  }

  return (
    <div className={classes.frame()}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          willChange: 'transform',
          gap: 4,
        }}
      >
        <Table className={classes.toggle()} />
        <Text
          className={classes.title()}
          style={{
            fontFamily: 'inherit',
            fontSize: 16,
          }}
        >
          {props.title}
        </Text>
        {props.meta ? <M /> : null}
      </div>
    </div>
  )
})

const M = () => (
  <svg viewBox='0 0 24 24' width={16}>
    <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
  </svg>
)
const Table = (props: { className?: string }) => (
  <svg {...props} viewBox='0 0 24 24' width={16}>
    <path d='M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z' />
  </svg>
)
