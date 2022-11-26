import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userAccount } from "../redux/userSlice";
import { Account } from "../shared/api";

export default function MyProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(userAccount({ id: user.userId, token: user.token }));
  }, [user.token]);

  const accountContent = () => {
    if (user.account != null) {
      return (
        <div className="row">
          <h2>MyProfile</h2>
          <p>
            <b>Username:</b>&nbsp;{user.account.username}
          </p>
          <p>
            <b>Password:</b>&nbsp;{user.account.password}
          </p>
          <p>
            <b>ID:</b>&nbsp;{user.account.id}
          </p>
          <p>
            <b>Admin:</b>&nbsp;{user.account.admin ? "true" : "false"}
          </p>
        </div>
      );
    }
  };
  return <div className="container">{accountContent()}</div>;
}
