import React, { ChangeEvent, useRef, useState } from 'react'
import type { Data } from './Tree'
import { Center, Button } from '@chakra-ui/react'
import XLSX from 'xlsx'

type Props = { setData: (data: Data[]) => void }

type Zxc = Data & { key: string; indexInGroup: string; parent: string; pos: number }

export default function SheetJSApp(props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    setError(false)
    setIsLoading(true)

    reader.onload = (e) => {
      try {
        /* Parse data */
        const ab = e?.target?.result
        const wb = XLSX.read(ab, { type: 'array' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[1]
        const ws = wb.Sheets[wsname]

        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

        const temp = data
          .map((item: any) => {
            if (item[11]) {
              return {
                type: 'branch',
                key: item[6],
                indexInGroup: item[10],
                pos: +item[11].slice(1),
                parent: item[12],
                title: item[15],
                nodes: [],
              } as Zxc
            }

            return {
              type: 'leaf',
              key: item[6],
              indexInGroup: item[10],
              pos: 0,
              parent: item[12],
              title: item[15],
            } as Zxc
          })
          .filter((item) => Boolean(item.indexInGroup))
          .slice(2)

        const temp2 = temp.reduce((acc, cur) => {
          const lastIndex = acc.length - 1
          const curIndex = cur.indexInGroup

          if (curIndex === '1') {
            acc.push([cur])
          } else {
            acc[lastIndex].push(cur)
          }

          return acc
        }, [] as typeof temp[])

        let currentParent: typeof temp[number]

        temp2.forEach((temp) =>
          temp.reduce((acc, item) => {
            if (item.pos) {
              const parent = acc
                .slice()
                .reverse()
                .find((i) => i?.pos && i.pos < (item as any).pos)

              item.parent = parent?.key ?? ''

              if (parent && 'nodes' in parent) {
                parent.nodes?.push(item)
              }

              currentParent = item
            } else {
              if (currentParent && 'nodes' in currentParent) {
                currentParent.nodes?.push(item)
              }
              item.parent = currentParent?.key
            }
            acc.push(item)
            return acc
          }, [] as typeof temp)
        )

        props.setData(temp2.map((item) => item[0]) as any)

        if (temp2.length === 0) {
          throw new Error('')
        }
      } catch (e) {
        console.log(e)
        setTimeout(() => {
          setIsLoading(false)
          setError(true)
        }, 100)
      }
    }

    setTimeout(() => reader.readAsArrayBuffer(file), 10)
  }

  return (
    <DragDropFile handleFile={handleFile}>
      <DataInput handleFile={handleFile} isLoading={isLoading} error={error} />
    </DragDropFile>
  )
}

function DragDropFile({
  handleFile,
  children,
}: React.PropsWithChildren<{ handleFile: (file: File) => void }>) {
  const [isHovered, setIsHovered] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const suppress = (e: React.DragEvent<HTMLDivElement>) => {
    setIsHovered(true)
    e.stopPropagation()
    e.preventDefault()
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsHovered(false)
    e.stopPropagation()
    e.preventDefault()
  }

  const suppress2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsHovered(false)

    const files = e.dataTransfer.files

    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  return (
    <Center height='100%' width='100%' p={10}>
      <Center
        borderColor={isHovered ? 'rgba(0, 150, 0, 1)' : 'transparent'}
        backgroundColor={isHovered ? 'rgba(0, 150, 0, 0.4)' : 'transparent'}
        transition='all 0.3s ease'
        height='100%'
        width='100%'
        borderWidth={1}
        borderRadius={10}
        borderStyle='solid'
        onDrop={handleDrop}
        onDragEnterCapture={suppress2}
        onDragOverCapture={suppress}
        onDragLeaveCapture={onDragLeave}
        ref={ref}
      >
        {children}
      </Center>
    </Center>
  )
}

function DataInput({
  handleFile,
  isLoading,
  error,
}: {
  handleFile: (file: File) => void
  isLoading: boolean
  error: boolean
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const ref = useRef<HTMLInputElement>(null)

  return (
    <form>
      <Button
        onClick={(e) => ref.current?.click()}
        isLoading={isLoading}
        borderColor={error ? 'red' : `transparent`}
        borderWidth={2}
      >
        Drag or choose a spreadsheet file
        <input
          type='file'
          id='file'
          accept={SheetJSFT}
          onChange={handleChange}
          style={{ display: 'none' }}
          ref={ref}
        />
      </Button>
    </form>
  )
}

const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map((x) => `.${x}`)
  .join(',')
