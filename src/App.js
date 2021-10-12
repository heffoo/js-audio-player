import React, { useState, useRef, useEffect } from "react";
import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const tracks = [
    {
      title: "HIM - Pretending",
      src: "./audio/pretending.mp3",
    },
    {
      title: "Pain - Shut Your Mouth",
      src: "./audio/pain.mp3",
    },
    {
      title: "Crazytown - Butterfly",
      src: "./audio/butterfly.mp3",
    },
  ];

  const [currentTrack, setCurrentTrack] = useState(tracks[0]);

  const [play, setPlay] = useState("pause");
  const [progressBarPercent, setProgressBarPercent] = useState(0);

  const audio = useRef();

  function playTrack() {
    setPlay("play");
    audio.current.play();
  }

  function pauseTrack() {
    setPlay("pause");
    audio.current.pause();
  }

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      playTrack();
    }
  }, [currentTrack]);

  function prevTrack() {
    let index = tracks.findIndex((el) => el.title === currentTrack.title);
    setCurrentTrack(index === 0 ? tracks[2] : tracks[index - 1]); // потом пофиксить (чтоб было -1, а не -2, разобраться почему так ваще)

    audio.current.load();
  }

  function nextTrack() {
    let index = tracks.findIndex((el) => el.title === currentTrack.title);
    setCurrentTrack(index > tracks.length - 2 ? tracks[0] : tracks[index + 1]); // потом пофиксить (чтоб было -1, а не -2, разобраться почему так ваще)

    audio.current.load();
  }

  function progressBar() {
    const { duration, currentTime } = audio.current;
    setProgressBarPercent((currentTime / duration) * 100);
  }

  function rewindSong(e) {
    const barWidth = 600;
    const clickX = e.nativeEvent.offsetX;
    const { duration } = audio.current;

    audio.current.currentTime = (clickX / barWidth) * duration;
  }

  return <div className="App">
      <div className="player">
        <label>{currentTrack.title}</label>
        <div className="buttons">
          <button className="control-button" onClick={prevTrack}>
            <FontAwesomeIcon icon="chevron-circle-left" />
          </button>
          {play === "pause" ? (
            <button className="control-button" onClick={playTrack}>
              play
            </button>
          ) : (
            <button className="control-button" onClick={pauseTrack}>
              pause
            </button>
          )}
          <button className="control-button" onClick={nextTrack}>
            <FontAwesomeIcon icon="chevron-circle-right" />
          </button>
        </div>
        <audio
          ref={audio}
          className="audio1"
          src={currentTrack.src}
          onTimeUpdate={progressBar}
          onEnded={nextTrack}
        />
        <div className="progressbar" onClick={rewindSong}>
          <div className="progress" style={{ width: progressBarPercent + "%" }}></div>
        </div>
      </div>
    </div>
}

export default App;