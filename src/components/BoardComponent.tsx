import React, { useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import * as Board from "../model/board";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  generator,
  createBoard,
  gamePost,
  gamePatch,
  setCurrentMove,
  updateMoveCountdown,
  setMoveNotifications,
  updateBoard,
  finishGame,
} from "../redux/boardSlice";
import styles from "../css/Board.style";
import { userInfo } from "os";

type TableRow = {
  row: string[];
  index: number;
};

export default function BoardComponent() {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const game = useAppSelector((state) => state.board.game);
  const board = useAppSelector((state) => state.board.board);
  const score = useAppSelector((state) => state.board.score);
  const currentMove = useAppSelector((state) => state.board.currentMove);
  const moveCountdown = useAppSelector((state) => state.board.moveCountdown);
  const moveNotification = useAppSelector(
    (state) => state.board.moveNotification
  );
  const [newGame, setNewGame] = useState(false);

  function handleCurrentMove(id: string) {
    //extract data
    const move: Board.Position = {
      row: Number(id.charAt(0)),
      col: Number(id.charAt(1)),
    };

    //manage move1, move2
    if (currentMove === null) {
      dispatch(setCurrentMove(move));
    } else {
      //update move countdown
      dispatch(updateMoveCountdown());

      //find out if legal move
      const canMove = Board.canMove(board, currentMove, move);

      //manage legal move
      if (canMove.canMove) {
        const result = Board.move(generator, board, currentMove, move);

        //extract move effects
        const resultEffects = result.effects.filter(
          (effect) => effect.kind === "Match"
        );

        dispatch(setMoveNotifications(resultEffects));
        dispatch(
          updateBoard({ board: result.board, score: resultEffects.length })
        );
      } else {
        dispatch(setMoveNotifications(null));
      }

      dispatch(setCurrentMove(null));
    }

    //check moveCountdown
    if (moveCountdown - 1 === 0) {
      handleFinishGame();
    }
  }

  const handleNewGame = () => {
    if (loggedUser.token != null) {
      setNewGame(true);
      dispatch(gamePost(loggedUser.token));
      setTimeout(() => dispatch(createBoard()), 1000);
    }
  };

  const handleFinishGame = () => {
    if (loggedUser.token != null) {
      dispatch(finishGame());
      if (game != null) {
        dispatch(
          gamePatch({
            token: loggedUser.token,
            user: loggedUser.userId,
            id: game.id,
            score: score,
            completed: true,
          })
        );
      }
    }
  };

  function ConstructTableRow({ row, index }: TableRow): any {
    const res: JSX.Element[] = new Array<JSX.Element>(row.length);

    row.map((cell, cellIndex) => {
      const id = index + cellIndex.toString(10);
      res.push(
        <td key={id} onClick={() => handleCurrentMove(id)}>
          {cell}
        </td>
      );
    });

    return res;
  }

  return (
    <div className="p-3 mt-5 bg-light bg-gradient">
      <div className="row">
        <div className="col-5 d-flex">
          <p>Score: {score}&emsp;</p>
          <p>Moves left: {moveCountdown}&emsp;</p>
        </div>
        <div className="col-3">
          <Button onClick={handleFinishGame}>Finish Game</Button>
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
      <div className="row" style={styles.emptyBoard}>
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
                  <ConstructTableRow row={...tableRow} index={index} />
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <div className="row">
        <div className="col-2 offset-5">
          <Button
            style={newGame == false ? styles.newGameBtn : null}
            onClick={handleNewGame}
          >
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
