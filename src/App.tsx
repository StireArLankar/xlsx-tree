import { Suspense, useState } from 'react'
import { ChakraProvider, Button, Box } from '@chakra-ui/react'
import SheetJSApp from './test'
// import { Data, Tree } from './Tree'
// import { Data, Tree } from './AnimatedTree'
import { Data, Tree } from './ChakraTree'

function App() {
  const [data, setData] = useState<Data[]>([])

  return (
    <Suspense fallback={null}>
      {data.length === 0 ? (
        <ChakraProvider>
          <SheetJSApp setData={setData} />
        </ChakraProvider>
      ) : (
        <ChakraProvider>
          <Box p={5}>
            <Button onClick={(_) => setData([])}>Reset</Button>
          </Box>
        </ChakraProvider>
      )}

      {data.length > 0 && (
        <Box p={20} paddingTop={0}>
          {data.map((item, index) => (
            <Tree key={index} {...item} defaultOpen />
          ))}
        </Box>
      )}
    </Suspense>
  )
}

export default App
