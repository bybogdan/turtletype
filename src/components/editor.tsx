import { useEffect, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import toast from 'react-hot-toast'

const mock =
  'because the perception of color is an important aspect of human life, different colors have been associated with emotions, activity, and nationality. names of color regions in different cultures can have different, sometimes overlapping areas. in visual arts, color theory is used to govern the use of colors in an aesthetically pleasing and harmonious way.'.replace(
    /[,.]/g,
    ''
  )

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
      const wpm = (mock.length / 5 / (time / 1000 / 60)).toFixed(0)
      const accuracy =
        (
          (res.current.filter((v) => v === 'correct').length / mock.length) *
          100
        ).toFixed(0) + '%'

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } p-4 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 text-start	">
            <p className="text-sm font-medium text-gray-900">Your results:</p>
            <p className="mt-1 text-sm text-gray-500">
              words per minute: <b className="text-black">{wpm}</b>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              accuracy: <b className="text-black">{accuracy}</b>
            </p>
          </div>
          <div className="self-center">
            <button
              type="button"
              className="mt-2 inline-block rounded bg-neutral-800 px-4 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
              onClick={() => window.location.reload()}
            >
              Try again 🔄
            </button>
          </div>
        </div>
      ))
    }
  }, [isStarted, isFinished])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      toast(`Backspace is not allowed, let it go 💃`)
      return
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <label
      htmlFor="editor"
      className="flex flex-col justify-between gap-20 h-screen p-10"
    >
      <h1 className="text-5xl">turtletype</h1>
      <p className="text-3xl tracking-wider">
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
      <div />
    </label>
  )
}
