import type { Data } from './types'
import XLSX from 'xlsx'

function* _generateId() {
  let id = 1

  while (true) {
    yield id
    id++
  }
}

const generateId = _generateId()

export const handleFile = (file: File) => {
  return new Promise<Data[]>((res, rej) => {
    const reader = new FileReader()

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
            temp: item[13],
            title: item[15],
            children: [],
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
              parent.children.push(test)
              test.parent = parent?.kee
            }
          } else {
            const parent = parents.find((item) => item.kee === test.parent)

            if (parent) {
              parent.children.push(test)
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
          root = root[0].children
        }

        if (!root || root.length === 0) {
          throw new Error('')
        }

        res(root)

        console.log(JSON.stringify(root))
      } catch (e) {
        rej(e)
        console.log(e)
      }
    }

    setTimeout(() => reader.readAsArrayBuffer(file), 10)
  })
}

export const SheetJSFT = [
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
