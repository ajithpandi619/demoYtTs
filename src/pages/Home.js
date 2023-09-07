import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CategoryItems } from "../static/data";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import Video from "../components/Video";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(db, "videos"));
    onSnapshot(q, (snapShot) => {
      setVideos(
        snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="w-[calc(100%-240px)]  h-[calc(100%-53px)] pt-16 bg-yt-black ml-60">
        <div className="relative flex flex-row px-3 overflow-x-scroll scrollbar-hide">
          {CategoryItems.map((item, i) => (
            <h2
              className="px-4 py-2 mr-3 text-sm font-normal rounded-lg cursor-pointer text-yt-white break-keep whitespace-nowrap bg-yt-light hover:bg-yt-light-1"
              key={i}
            >
              {item}
            </h2>
          ))}
        </div>

        <div className="grid px-5 pt-12 grid-cols-yt gap-x-3 gap-y-8">
          {videos.length === 0 ? (
            <div className="h-[86vh]"></div>
          ) : (
            videos.map((video, i) => (
              <Link to={`/video/${video.id}`} key={video.id}>
                <Video {...video} />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
