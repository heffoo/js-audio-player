import React, { useState, useRef, useEffect } from "react";
import { MdRepeat, MdRepeatOne } from "react-icons/md";
import { GoUnmute, GoMute } from "react-icons/go";
import { IoPlay, IoPlayForward, IoPlayBack, IoPause } from "react-icons/io5";

import "./App.scss";

function App() {
  const tracks = [
    {
      singer: "HIM",
      track: "Pretending",
      title: "HIM - Pretending",
      cover: "./assets/pretending_cover.png",
      src: "./audio/pretending.mp3",
    },
    {
      singer: "Pain",
      track: "Shut Your Mouth",
      title: "Pain - Shut Your Mouth",
      cover: "./assets/pain.png",
      src: "./audio/pain.mp3",
    },
    {
      singer: "Crazytown",
      track: "Butterfly",
      title: "Crazytown - Butterfly",
      cover: "./assets/butterfly.png",
      src: "./audio/butterfly.mp3",
    },
    {
      singer: "Dreadful Shadows",
      track: "Futility",
      title: "Dreadful Shadows - Futility",
      cover: "./assets/ds.png",
      src: "./audio/futility.mp3",
    },
    {
      singer: "Soundgarden",
      track: "Black Hole Sun",
      title: "Soundgarden - Black Hole Sun",
      cover: "./assets/soundgarden.png",
      src: "./audio/soundgarden.mp3",
    },
  ];

  const [currentTrack, setCurrentTrack] = useState(tracks[0]);

  const [play, setPlay] = useState("pause");
  const [progressBarPercent, setProgressBarPercent] = useState(0);
  const [progressCounter, setProgressCounter] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const audio = useRef();
  const mounted = useRef(false);

  function playTrack() {
    setPlay("play");
    audio.current.play();
  }

  function pauseTrack() {
    setPlay("pause");
    audio.current.pause();
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      playTrack();
    }
  }, [currentTrack]);

  function prevTrack() {
    let index = tracks.findIndex((el) => el.title === currentTrack.title);
    setCurrentTrack(index === 0 ? tracks[4] : tracks[index - 1]);

    audio.current.load();
  }

  function nextTrack() {
    let index = tracks.findIndex((el) => el.title === currentTrack.title);
    setCurrentTrack(index > tracks.length - 2 ? tracks[0] : tracks[index + 1]);

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

  function formateTime(minutes, seconds) {
    return [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
  }

  function counter(e) {
    let timestamp = e.target.currentTime;
    let minutes = Math.floor(timestamp / 60);
    let seconds = Math.floor(timestamp % 60);

    setProgressCounter(formateTime(minutes, seconds));
  }

  function calculateDuration(e) {
    let duration = e.target.duration;

    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);

    setDuration(formateTime(minutes, seconds));
  }

  return <div className="App">
      <div className="player">
        <img style={{ width: 200 }} src={currentTrack.cover} alt="cover" />
        <div className="buttons">
          <button className="control-button" onClick={prevTrack}>
            <IoPlayBack />
          </button>
          {play === "pause" ? (
            <button className="control-button" onClick={playTrack}>
              <IoPlay />
            </button>
          ) : (
            <button className="control-button" onClick={pauseTrack}>
              <IoPause />
            </button>
          )}
          <button className="control-button" onClick={nextTrack}>
            <IoPlayForward />
          </button>
        </div>
        <div className="title">
          <label className="singer">{currentTrack.singer}</label>
          <label>{currentTrack.track}</label>
        </div>
        <audio
          ref={audio}
          className="audio1"
          src={currentTrack.src}
          onTimeUpdate={(e) => {
            progressBar();
            counter(e);
          }}
          onLoadedMetadata={(e) => calculateDuration(e)}
          onEnded={nextTrack}
          muted={muted}
          loop={repeat}
        />
        <div className="progress-buttons">
          <button className="progress-buttons__button" onClick={() => setMuted(!muted)}>
            {muted ? <GoMute /> : <GoUnmute />}
          </button>
          <button className="progress-buttons__button" onClick={() => setRepeat(!repeat)}>
            {repeat ? <MdRepeatOne /> : <MdRepeat />}
          </button>
        </div>
        <div className="progressbar" onClick={rewindSong}>
          <div className="time">{progressCounter}</div>
          <div className="endTime">{duration}</div>
          <div className="progress" style={{ width: progressBarPercent + "%" }}></div>
        </div>
      </div>
    </div>
}

export default App;
