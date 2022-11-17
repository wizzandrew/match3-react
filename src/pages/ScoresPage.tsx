import React, { Dispatch } from 'react'

type ScoreProps = {
  counter: number,
  dispatch: any
}

export default function ScoresPage({counter, dispatch} : ScoreProps) {
  return (
    <div>
        <h2>Scores</h2>
        <p>Counter: {counter}</p>
        <button onClick={dispatch}>CLick</button>
    </div>
  )
}
