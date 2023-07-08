import { useEffect, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'

const mock =
  'because the perception of color is an important aspect of human life, different colors have been associated with emotions, activity, and nationality. names of color regions in different cultures can have different, sometimes overlapping areas. in visual arts, color theory is used to govern the use of colors in an aesthetically pleasing and harmonious way.'

type ResType = ('correct' | 'wrong' | 'idle')[]

const preparedMock = mock.split('').map((char, wordIndex) => {
  return {
    value: char,
    id: wordIndex,
    isSpace: char === ' ',
  }
})

export const Editor = () => {
  const res = useRef<ResType>(new Array(mock.length).fill('idle') as ResType)
  const inputRef = useRef<HTMLInputElement>(null)

  const [userValue, setUserValue] = useState('')
  const [isStarted, setIsStarted] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState<number | null>(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStarted === null) {
      setIsStarted(Date.now())
    }

    const {
      target: { value },
    } = e
    setUserValue(value)

    const idx = value.length - 1
    // finish
    if (idx >= mock.length - 1) {
      setIsFinished(Date.now())
    }

    const lNode = document.getElementById(`l-${idx}`)
    lNode?.classList.remove('idle')

    const isSpace = lNode?.classList.contains('space')
    const isCorrect = value[idx] === mock[idx]

    if (isSpace) {
      lNode?.classList.add(isCorrect ? 'space-correct' : 'space-wrong')
    } else {
      lNode?.classList.add(isCorrect ? 'correct' : 'wrong')
      res.current[idx] = isCorrect ? 'correct' : 'wrong'
    }
  }

  useEffect(() => {
    if (isStarted && isFinished) {
      const time = isFinished - isStarted
      console.log(`time: ${time}`)
      console.log(`wpm: ${mock.length / 5 / (time / 1000 / 60)}`)
      console.log(
        `accuracy: ${
          res.current.filter((v) => v === 'correct').length / mock.length
        }`
      )
    }
  }, [isStarted, isFinished])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <label htmlFor="editor" className="flex flex-col gap-20 h-screen p-10">
      <h1 className="text-3xl">turtletype</h1>
      <p>
        <Balancer>
          {preparedMock.map((l, lIndex) => (
            <span
              key={l.id.toString()}
              id={`l-${l.id}`}
              className={`idle ${l.isSpace ? 'space' : ''} ${
                lIndex === 0 ? 'current' : ''
              }`}
            >
              {l.value}
            </span>
          ))}
        </Balancer>
      </p>
      <input
        id="editor"
        disabled={!!isFinished}
        value={userValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        type="text"
        className="opacity-0 w-0 h-0 absolute"
        ref={inputRef}
      />
    </label>
  )
}
