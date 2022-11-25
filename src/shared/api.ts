import { URL } from "./utils";
import { Game } from "../redux/boardSlice";

export type LoginProps = {
  username: string;
  password: string;
};

export type PatchGame = { token: string } & Game;

export type LoginReply = {
  token: string;
  userId: number;
  error?: string;
};

export async function loginUser(login: LoginProps): Promise<LoginReply> {
  let result: LoginReply;

  const response = await fetch(URL + "login", {
    method: "POST",
    body: JSON.stringify(login),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = data))
      .catch((err) => console.log(err));
  } else {
    result = {
      token: null,
      userId: null,
      error: response.statusText,
    };
  }
  return result;
}

export async function logoutUser(token: string): Promise<{ success: boolean }> {
  let result;

  const response = await fetch(URL + "logout?token=" + token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = data.success))
      .catch((err) => console.log(err));
  } else {
    throw new Error("\nStatus: " + response.status + " " + response.statusText);
  }

  return result;
}

export async function postGame(token: string): Promise<Game> {
  let result: Game;

  const response = await fetch(URL + "games?token=" + token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = data))
      .catch((err) => console.log(err));
  } else {
    throw new Error("\nStatus: " + response.status + " " + response.statusText);
  }
  return result;
}

export async function patchGame(
  game: PatchGame
): Promise<{ success: boolean }> {
  let result;

  const response = await fetch(
    URL + "games/" + game.id + "?token=" + game.token,
    {
      method: "PATCH",
      body: JSON.stringify({
        user: game.user,
        id: game.id,
        score: game.score,
        completed: game.completed,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    }
  );

  if (response.ok) {
    await response
      .json()
      .then((data) => (result = { success: data.success }))
      .catch((err) => console.log(err));
  } else {
    throw new Error("\nStatus: " + response.status + " " + response.statusText);
  }
  return result;
}
