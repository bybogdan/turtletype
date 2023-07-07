import { useEffect, useRef, useState } from 'react'
import Balancer from 'react-wrap-balancer'

const mock =
  'because the perception of color is an important aspect of human life, different colors have been associated with emotions, activity, and nationality. names of color regions in different cultures can have different, sometimes overlapping areas. in visual arts, color theory is used to govern the use of colors in an aesthetically pleasing and harmonious way.'

const lengthWithoutSpaces = mock.split(' ').join('').length
let lengthWithoutSpacesDiff = lengthWithoutSpaces

type ResType = ('correct' | 'wrong' | 'idle')[]

const preparedMock = mock.split(' ').map((word, wordIndex) => {
  const letters = word.split('')
  return letters.map((l) => {
    const idx = lengthWithoutSpaces - lengthWithoutSpacesDiff
    lengthWithoutSpacesDiff -= 1
    return {
      value: l,
      id: wordIndex === 0 ? idx : idx + wordIndex, // wordIndex for space
    }
  })
})

export const Editor = () => {
  const res = useRef<ResType>(new Array(mock.length).fill('idle') as ResType)

  const [userValue, setUserValue] = useState('')
  const [isDisabledInput, setIsDisabledInput] = useState(false)
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
      setIsDisabledInput(true)
    }

    if (value[idx] === mock[idx]) {
      const lNode = document.getElementById(`l-${idx}`)
      lNode?.classList.remove('idle')
      lNode?.classList.add('correct')
      res.current[idx] = 'correct'
    } else {
      const lNode = document.getElementById(`l-${idx}`)
      lNode?.classList.remove('idle')
      lNode?.classList.add('wrong')
      res.current[idx] = 'wrong'
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

  return (
    <div className="flex flex-col gap-20">
      Editor
      <label htmlFor="editor">
        <p>
          <Balancer>
            {preparedMock.map((w, wordI) => (
              <span key={`${w.toString()}-${wordI}`} id={`w-${wordI}`}>
                {w.map((l, lIndex) => (
                  <span
                    key={l.id.toString()}
                    id={`l-${l.id}`}
                    className={`idle ${
                      lIndex === 0 && wordI === 0 ? 'current' : ''
                    }`}
                  >
                    {l.value}
                  </span>
                ))}{' '}
              </span>
            ))}
          </Balancer>
        </p>
      </label>
      <input
        id="editor"
        disabled={isDisabledInput}
        value={userValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        type="text"
        className="opacity-0 w-0 h-0 absolute"
      />
    </div>
  )
}
