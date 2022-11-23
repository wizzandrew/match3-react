import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/HeaderComponent";
import Play from "./pages/PlayPage";
import Scores from "./pages/ScoresPage";
import MyProfile from "./pages/MyProfilePage";

function App() {
  const Router = () => {
    return (
      <Routes>
        <Route index element={<Play />} />
        <Route path="/play" element={<Play />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Routes>
    );
  };

  return (
    <div>
      <Header />
      <Router />
    </div>
  );
}

export default App;
