import { Editor } from './components/editor'

import './App.css'

function App() {
  return (
    <div className="flex flex-col gap-20">
      <h1 className="text-3xl">turtletype</h1>
      <Editor />
    </div>
  )
}

export default App
