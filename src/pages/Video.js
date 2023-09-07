import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addDoc, collection, doc, onSnapshot, query } from "firebase/firestore";
import { auth, db, timestamp } from "../firebase";
import { AiFillLike } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { HiDotsHorizontal, HiDownload } from "react-icons/hi";
import { MdOutlineSort } from "react-icons/md";
import { BiDislike } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import Comment from "../components/Comment";
import { CategoryItems } from "../static/data";
import RecommendVideo from "../components/RecommendVideo";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState(null);

  const [comment, setComment] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    if (id) {
      const q = query(doc(db, "videos", id));
      onSnapshot(q, (snapShot) => {
        setData(snapShot.data());
      });
      const commentsQuery = query(collection(db, "videos", id, "comments"));
      onSnapshot(commentsQuery, (snapShot) => {
        setComments(
          snapShot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    }
  }, [id]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

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

  const addComment = async (e) => {
    e.preventDefault();
    let commentData = {
      image: user.photoURL,
      name: user.displayName,
      comment,
      uploaded: timestamp,
    };
    if (id) {
      await addDoc(collection(db, "videos", id, "comments"), commentData);
      setComment("");
    }
  };

  return (
    <div className="flex flex-row h-full py-20 px-9 bg-yt-black">
      <div className="flex-1 left">
        <div className="flex justify-center">
          <iframe
            src={`https://www.youtube.com/embed/${data?.link}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-[850px] h-[700px] flex-1"
          ></iframe>
        </div>
        <h2 className="mt-3 mb-1 text-lg font-semibold text-yt-white">
          {data?.title}
        </h2>
        <div className="flex">
          <div className="flex items-center">
            <img
              src={data?.logo}
              alt={data?.channel}
              className="w-10 h-10 rounded-full"
            />
            <div className="px-3">
              <h3 className="text-base font-medium text-yt-white">
                {data?.channel && data?.channel.length <= 25
                  ? data?.channel
                  : `${data?.channel && data?.channel.substr(0, 20)}...`}
              </h3>
              <p className="text-sm text-yt-gray">
                {data?.subscribers} subscribers
              </p>
            </div>
            <button className="px-3 py-2 ml-3 text-sm font-medium rounded-lg bg-yt-white">
              Subscribe
            </button>
            <div className="flex pl-28">
              <div className="flex items-center h-10 mx-1 bg-yt-light-black rounded-2xl hover:bg-yt-light-1">
                <div className="flex items-center px-3 border-r-2 cursor-pointer border-r-yt-light-1">
                  <AiFillLike className="text-2xl text-yt-white" />
                  <p className="pl-2 pr-3 text-sm font-semibold text-yt-white">
                    300K
                  </p>
                </div>
                <div className="pl-4 pr-5 cursor-pointer">
                  <BiDislike className="text-[22px] font-extralight text-yt-white" />
                </div>
              </div>
              <div className="flex items-center h-10 mx-1 cursor-pointer bg-yt-light-black rounded-2xl hover:bg-yt-light-1">
                <div className="flex items-center px-3 cursor-pointer">
                  <RiShareForwardLine className="text-2xl font-thin text-yt-white" />
                  <p className="pl-2 pr-3 text-sm font-semibold text-yt-white">
                    Share
                  </p>
                </div>
              </div>
              <div className="flex items-center h-10 mx-1 cursor-pointer bg-yt-light-black rounded-2xl hover:bg-yt-light-1">
                <div className="flex items-center px-3 cursor-pointer">
                  <HiDownload className="text-2xl font-thin text-yt-white" />
                  <p className="pl-2 pr-3 text-sm font-semibold text-yt-white">
                    Download
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-yt-light-black hover:bg-yt-light-1 text-yt-white">
                <HiDotsHorizontal />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl p-3 mt-4 text-sm bg-yt-light-black rounded-2xl text-yt-white">
          <div className="flex">
            <p className="pr-3 font-medium">
              {data?.views}
              <span className="pl-1 text-xs">Views</span>
            </p>
            <p className="pr-3 font-medium">{data?.uploadTime}</p>
          </div>
          <span className="font-medium text-center">{data?.description}</span>
        </div>
        <div className="mt-5 text-yt-white">
          <div className="flex items-center">
            <h1>{comments.length} Comments</h1>
            <div className="flex items-center mx-10">
              <MdOutlineSort size={30} className="mx-3" />
              <h5>Sort by</h5>
            </div>
          </div>

          {user && (
            <form
              onSubmit={addComment}
              className="flex w-[800px] pt-4 items-start"
            >
              <img
                src={user?.photoURL}
                alt="profile"
                className="w-12 h-12 mr-3 rounded-full"
              />
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Add a comment..."
                className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full"
              />
            </form>
          )}
          <div className="mt-4">
            {comments.map((item, i) => (
              <Comment key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="right px-3 overflow-y-hidden flex-[0.4]">
        <div>
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
        </div>
        <div className="pt-8">
          {videos.map((video, i) => {
            if (video.id !== id) {
              return (
                <Link key={i} to={`/video/${video.id}`}>
                  <RecommendVideo {...video} />
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Video;
