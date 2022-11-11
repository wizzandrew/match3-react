import React, { useState, useEffect } from 'react'
import { Table, Button } from 'reactstrap';
import * as Board from '../model/board';

type TableRow = {
    row: string[]
}

export default function BoardComponent() {
  const [generator, setGenerator] = useState<Board.Generator<string>>(Board.CyclicGenerator('ABCD'))  
  const [board, setBoard] = useState<Board.Board<string>>(Board.create(generator, 4, 4));
  const [newGame, setNewGame] = useState(false);

  
  function ConstructTableRow( tableRow : TableRow) : any  {

    const res: JSX.Element[] = new Array<JSX.Element>(tableRow.row.length);

    tableRow.row.map(cell => {
        res.push(<td>{cell}</td>);
    })

    return res;
  }

  return (
    <div className='p-3 mt-5 bg-light bg-gradient'>
        <div className="row">
            <div className="col-5 d-flex">
                <p>Score: 0&emsp;</p>
                <p>Moves left: 10&emsp;</p>
            </div>
            <div className="col-3">
                <Button>Finish Game</Button>
            </div>
            <div className="col-3 d-flex justify-content-end">
                <Button color="danger">X</Button>
            </div>
            <hr />
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

            {newGame && board.tiles && (
                <Table bordered>
                    <tbody>
                        {board.tiles.map(tableRow => 
                            <tr key={tableRow.toString()}>
                                <ConstructTableRow row={...tableRow} />
                            </tr>)}
                    </tbody>
                </Table>
            )}
        </div>
        <div className="row">
            <div className="col-2 offset-5">
                <Button onClick={() => setNewGame(true)}>New Game</Button>
            </div>
        </div>
    </div>
  )
}
