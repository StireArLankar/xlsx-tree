export type Data = {
  kee: any
  division: any
  parent: any
  title: any
  temp: any
  children: Data[]
}

export type ReadyData = {
  title: string
  temp: string
  children: ReadyData[]
  open?: boolean
}
