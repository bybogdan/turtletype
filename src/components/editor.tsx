import { useEffect, useMemo, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import toast from 'react-hot-toast'
import { mocks } from '../mocks'

type ResType = ('correct' | 'wrong' | 'idle')[]

export const Editor = () => {
  const mock = useMemo(
    () =>
      mocks[Math.floor(Math.random() * mocks.length)]
        .trim()
        .toLowerCase()
        .replace(/[,.:`]/g, ''),
    []
  )

  const res = useRef<ResType>(new Array(mock.length).fill('idle') as ResType)
  const inputRef = useRef<HTMLInputElement>(null)

  const [userValue, setUserValue] = useState('')
  const [isStarted, setIsStarted] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState<number | null>(null)

  const preparedMock = mock.split('').map((char, wordIndex) => {
    return {
      value: char,
      id: wordIndex,
      isSpace: char === ' ',
    }
  })

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
          } p-4 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 mb-10`}
        >
          <div className="flex-1 w-0 text-start	">
            <p className=" font-medium text-gray-900">Your results:</p>
            <p className="mt-1  text-gray-500">
              words per minute: <b className="text-black">{wpm}</b>
            </p>
            <p className="mt-1  text-gray-500">
              accuracy: <b className="text-black">{accuracy}</b>
            </p>
          </div>
          <div className="self-center">
            <button
              type="button"
              className="mt-2 inline-block rounded bg-neutral-800 px-4 pb-2 pt-2.5 font-medium leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
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
      className={`flex flex-col justify-between gap-20 h-screen p-10 select-none ${
        isFinished ? 'opacity-20' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-4xl text-left">turtletype</h1>

        {/* TODO MAKE BUTTON LOOKS NICER */}
        <button
          type="button"
          className="px-4 pb-2 pt-2.5 font-medium leading-normal rounded inline-block dark:border-white border-black border-solid	 border-2 dark:hover:bg-slate-900 hover:bg-slate-100"
          onClick={() => window.location.reload()}
        >
          Change text 🔤
        </button>
      </div>
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
