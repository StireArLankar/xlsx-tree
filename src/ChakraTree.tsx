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

export type Data = {
  kee: any
  division: any
  parent: any
  title: any
  _children: Data[]
}

type TreeProps = Data & {
  style?: React.CSSProperties
  defaultOpen?: boolean
}

export const Tree = memo((props: TreeProps) => {
  if (props._children.length !== 0) {
    return (
      <Accordion allowToggle>
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
            {props.title ?? 'NO TITLE ' + props.kee}
          </AccordionButton>
          <AccordionPanel pb={4}>
            <div className={classes.content()}>
              {props._children.map((node, index) => (
                <Tree {...node} key={index} />
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
          {props.title ?? 'NO TITLE ' + props.kee}
        </Text>
      </div>
    </div>
  )
})

const Table = (props: { className?: string }) => (
  <svg {...props} viewBox='0 0 24 24' width={16}>
    <path d='M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z' />
  </svg>
)
