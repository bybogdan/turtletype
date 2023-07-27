import { useEffect, useMemo, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import toast from 'react-hot-toast'
import { mocks } from '../mocks'

type ResType = ('correct' | 'wrong' | 'idle')[]

const LC_BEST_RESULT = 'BEST_RESULT'

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

      let isNewRecord = false

      const prevBestResult = localStorage.getItem(LC_BEST_RESULT)
      const bestResult = Math.max(Number(prevBestResult), Number(wpm)).toFixed(
        0
      )

      if (prevBestResult) {
        if (Number(prevBestResult) < Number(wpm)) {
          isNewRecord = true
        }
      }

      localStorage.setItem(LC_BEST_RESULT, bestResult)

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } p-4 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 mb-10`}
        >
          <div className="flex-1 w-0 text-start">
            {isNewRecord ? (
              <p className="font-bold text-green-600">🎉 New record! 🎉</p>
            ) : null}
            <p className="font-medium text-gray-900">Current results:</p>

            <p className=" text-gray-500">
              words per minute: <b className="text-black">{wpm}</b>
            </p>
            <p className=" text-gray-500">
              accuracy: <b className="text-black">{accuracy}</b>
            </p>

            <div className="my-4" />
            <p className="font-medium text-gray-900">Your best result:</p>
            <p className=" text-gray-500">
              words per minute: <b className="text-black">{bestResult}</b>
            </p>
          </div>
          <div className="self-end">
            <button
              type="button"
              className="mt-2 inline-block rounded bg-neutral-800 px-4 pb-2 pt-2.5 font-medium leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
              onClick={() => window.location.reload()}
            >
              try again 🔄
            </button>
          </div>
        </div>
      ))
    }
  }, [isStarted, isFinished])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      toast(`backspace is not allowed, let it go 💃`)
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
      <div className="flex items-start gap-2">
        <img src="/turtleIcon.png" alt="turtle" className="w-8 h-8" />
        <h1 className="text-4xl text-left">turtletype</h1>

        {!isFinished ? (
          <button
            type="button"
            className="inline-block rounded bg-neutral-800 dark:bg-neutral-200 px-4 pb-2 pt-2.5 font-medium leading-normal text-neutral-50 dark:text-neutral-800 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 dark:hover:bg-neutral-300 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 dark:focus:bg-neutral-300 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 dark:active:bg-neutral-300 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]  dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2) vertical-align: top; text-decoration: inherit; text-wrap: balance;"
            onClick={() => window.location.reload()}
          >
            change text 🔄
          </button>
        ) : null}
      </div>
      <p className="text-3xl tracking-widest">
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
