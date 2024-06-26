import { Editor } from './components/editor'
import { Toaster } from 'react-hot-toast'

import './App.css'

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          custom: {
            duration: Infinity,
          },
        }}
      />
      <Editor />
    </>
  )
}

export default App
