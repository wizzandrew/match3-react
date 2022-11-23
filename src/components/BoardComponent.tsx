import React, { useState, useEffect } from 'react'
import { Table, Button } from 'reactstrap';
import * as Board from '../model/board';
import { useAppDispatch, useAppSelector} from '../redux/hooks';
import { createBoard, setCurrentMove, finishGame } from '../redux/boardSlice';

type TableRow = {
    row: string[];
    index: number
}

export default function BoardComponent() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.board);  
  const score = useAppSelector((state) => state.board.score);
  const moveCountdown = useAppSelector((state) => state.board.moveCountdown);
  const moveNotification = useAppSelector((state) => state.board.moveNotification);
  const [newGame, setNewGame] = useState(false);

  
  function ConstructTableRow( {row, index}: TableRow) : any  {
    const res: JSX.Element[] = new Array<JSX.Element>(row.length);

    row.map((cell, cellIndex) => {
        const id = index + cellIndex.toString(10);
        res.push(
        <td key={id} onClick={() => dispatch(setCurrentMove(id))}>{cell}</td>);
    });

    return res;
  }

  return (
    <div className='p-3 mt-5 bg-light bg-gradient'>
        <div className="row">
            <div className="col-5 d-flex">
                <p>Score: {score}&emsp;</p>
                <p>Moves left: {moveCountdown}&emsp;</p>
            </div>
            <div className="col-3">
                <Button onClick={() => dispatch(finishGame())}>Finish Game</Button>
            </div>
            <div className="col-3 d-flex justify-content-end">
                <Button color="danger">X</Button>
            </div>
            <hr />
        </div>
        <div className="row">
            <div className="col-4 offset-4 text-align-center">
                <p>{moveNotification}</p>
            </div>
        </div>
        <div className="row">
            {newGame == false && (
                <Table bordered>
                <tbody>
                    <tr>
                        <td>A</td>
                        <td>B</td>
                        <td>C</td>
                        <td>D</td>
                    </tr>
                    <tr>
                        <td>A</td>
                        <td>C</td>
                        <td>B</td>
                        <td>D</td>
                    </tr>
                    <tr>
                        <td>B</td>
                        <td>C</td>
                        <td>A</td>
                        <td>C</td>
                    </tr>
                    <tr>
                        <td>C</td>
                        <td>B</td>
                        <td>A</td>
                        <td>D</td>
                    </tr>
                </tbody>
            </Table>
            )}

            {newGame && board && board.tiles && (
                <Table bordered>
                    <tbody>
                        {board.tiles.map((tableRow, index) => (
                            <tr key={index}>
                                <ConstructTableRow row={...tableRow} index={index}/>
                            </tr>))}
                    </tbody>
                </Table>
            )}
        </div>
        <div className="row">
            <div className="col-2 offset-5">
                <Button onClick={() => {setNewGame(true); dispatch(createBoard());}}>New Game</Button>
            </div>
        </div>
    </div>
  )
}
