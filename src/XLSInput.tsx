import React, { ChangeEvent, useRef, useState } from 'react'
import type { Data } from './Tree'
import { Center, Button } from '@chakra-ui/react'
import XLSX from 'xlsx'

type Props = { setData: (data: Data[]) => void }

function* _generateId() {
  let id = 1

  while (true) {
    yield id
    id++
  }
}

const generateId = _generateId()

export const XLSInput = (props: Props) => {
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
        let data = XLSX.utils.sheet_to_json<any>(ws, { header: 1 })

        let item: any

        while (true) {
          item = data[0]

          if (!item) {
            break
          }

          if (typeof item[11] !== 'string') {
            data.shift()
          } else {
            break
          }
        }

        data.shift()

        if (data.length === 0) {
          throw new Error('')
        }

        data = data.filter((item) => Boolean(item[11]) || Boolean(item[12]) || Boolean(item[15]))

        const parents: Data[] = []

        const newData = data.map((item) => {
          const test: Data = {
            kee: item[6]?.toString() || '_' + generateId.next().value,
            division: item[11] ? +item[11].slice(1) : undefined,
            parent: item[12]?.toString(),
            _temp: item[13],
            title: item[15],
            _children: [],
          }

          if (parents.length === 0) {
            parents.unshift(test)
            return test
          }

          if (!test.parent) {
            const parent = parents.find((item) =>
              typeof test.division === 'number' ? item.division < test.division : true
            )

            if (!parent) {
              parents.unshift(test)
            } else {
              parent._children.push(test)
              test.parent = parent?.kee
            }
          } else {
            const parent = parents.find((item) => item.kee === test.parent)

            if (parent) {
              parent._children.push(test)
            }
          }

          if (test.division) {
            parents.unshift(test)
          }

          return test
        })

        console.log(newData)

        let root = newData.reduce((acc, cur) => {
          if (typeof cur.division !== 'number') {
            return acc
          }

          const temp = acc[0]

          if (!temp) {
            acc.push(cur)
            return acc
          }

          if (cur.division === temp.division) {
            acc.push(cur)
            return acc
          }

          if (cur.division < temp.division) {
            return [cur]
          }

          return acc
        }, [] as Data[])

        console.log(root)

        if (root.length === 1) {
          root = root[0]._children
        }

        if (!root || root.length === 0) {
          throw new Error('')
        }

        props.setData(root)
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

type DragAndDropFileProps = React.PropsWithChildren<{ handleFile: (file: File) => void }>
const DragDropFile = ({ handleFile, children }: DragAndDropFileProps) => {
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

type DataInputProps = {
  handleFile: (file: File) => void
  isLoading: boolean
  error: boolean
}

const DataInput = ({ handleFile, isLoading, error }: DataInputProps) => {
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
        onClick={() => ref.current?.click()}
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
