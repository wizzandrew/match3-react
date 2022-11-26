import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userGames } from "../redux/userSlice";
import { Game } from "../redux/boardSlice";
import * as _ from "lodash";

export default function TopScores() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    //fetch games
    // console.log("fetch games");
    dispatch(userGames(user.token));
  }, [user.token]);

  const top3Scores = () => {
    let top3games: Game[];

    if (user.token != null && Array.isArray(user.completedGames)) {
      const games = user.completedGames.filter((g) => g.completed);
      const sortedGames = _.cloneDeep(games);

      //sort array in ascending order
      sortedGames.sort((a, b) => b.score - a.score);

      //get 3 highest scores
      if (sortedGames.length >= 3) top3games = sortedGames.slice(0, 3);
      else if (sortedGames.length < 3) top3games = sortedGames;
    }
    return top3games;
  };

  return (
    <div>
      <ol>
        {Array.isArray(user.completedGames)
          ? top3Scores().map((score) => {
              return <li key={score.id}>Score: {score.score}</li>;
            })
          : "no games fetched"}
      </ol>
    </div>
  );
}
