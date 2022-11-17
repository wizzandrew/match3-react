import React from "react";
import {Routes, Route} from 'react-router-dom';
import Header from './components/HeaderComponent';
import Play from './pages/PlayPage';
import Scores from './pages/ScoresPage';
import MyProfile from './pages/MyProfilePage';

import {RootState} from './redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {increment} from './redux/counterSlice';


function App() {

    const counter: number = useSelector(
        (state: RootState) => state.counter.value
    );

    const dispatch = useDispatch();

    const incrementCounter = () => dispatch(increment());

    const Router = () => {
        return (
            <Routes>
                <Route index element={<Play />} />
                <Route path="/play" element={<Play />} />
                <Route path="/scores" element={<Scores counter={counter} dispatch={incrementCounter}/>} />
                <Route path="/myprofile" element={<MyProfile />} />
            </Routes>  
        );
    }

    return (
        <div>
            <Header />
            <Router />
        </div>
    );

    }

    

export default App; 