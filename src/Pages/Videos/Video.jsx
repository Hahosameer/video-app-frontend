import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comments from "../../components/Comments.jsx";
import {
  ThumbUp as LikeIconFilled,
  ThumbUpOutlined as LikeIconOutlined,
  ThumbDown as DislikeIconFilled,
  ThumbDownOutlined as DislikeIconOutlined,
  Share as ShareIcon,
  Bookmark as SaveIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
// import { dislike,  fetchSuccess,  like } from "../../redux/userSlice.js";
// import { subscription } from "../../redux/userSlice.js";
import Recommandations from "../../components/Recommandations.jsx";
import { dislike, like, fetchSuccess } from "../../redux/videoSlice.js";
import { serverUrl } from "../../components/utils/appConstans.js";
import { subscription } from "../../redux/userSlice.js";

const Container = styled.div`
  display: flex;
  gap: 24px;
  margin: 0 20px;

  @media screen and (max-width: 965px) {
    display: flex;
    flex-direction: column;
  }
`;
const Content = styled.div`
  flex: 4;
`;

const VideoWrapper = styled.div``;

const Tittle = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Detail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 640px) {
    display: flex;
    flex-direction: column;
  }
`;
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;
const Buttons = styled.span`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;
const Button = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  @media screen and (max-width: 640px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
`;
const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;
const ChannelName = styled.span`
  font-weight: 600;
`;
const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;
const Descripton = styled.p`
  font-size: 14px;
`;
const Subscribe = styled.button`
  background-color: #cc1a00;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  @media screen and (max-width: 380px) {
    // Adjust width for screens less than or equal to 768px
    padding: 7px 14px;
    font-weight: 400;
  }
  @media screen and (max-width: 358px) {
    // Adjust width for screens less than or equal to 768px
    padding: 4px 10px;
    font-weight: 400;
    font-size: 10px;
  }
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

function Video() {
  const { currentUser } = useSelector((state) => state?.user);
  const { currentVideo } = useSelector((state) => state?.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [video, setVideo] = useState({});
  const [channel, setChannel] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `${serverUrl}/api/videos/find/${path}`
        );
        const channelRes = await axios.get(
          `${serverUrl}/api/users/find/${videoRes.data.userId}`
        );
        setVideo(videoRes.data);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (error) {
        console.log("Error fetching video or channel data:", error);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      await axios.put(
        `${serverUrl}/api/users/like/${currentVideo._id}`,
        null,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(like(currentUser._id));
    } catch (error) {
      console.log("Error liking video:", error);
    }
  };
  const handleDislike = async (videoId) => {
    try {
      const response = await axios.put(
        `https://videp-app-backend.vercel.app/api/users/dislike/${videoId}`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      // Update the state or Redux store accordingly
    } catch (error) {
      console.error('Error disliking video:', error);
      // Additional error handling
    }
  };

  // const handleDislike = async () => {
  //   try {
  //     await axios.put(
  //       `${serverUrl}/api/users/dislike/${currentVideo._id}`,
  //       null,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     dispatch(dislike(currentUser._id));
  //   } catch (error) {
  //     console.log("Error disliking video:", error);
  //   }
  // };

  const handleSub = async () => {
    try {
      currentUser.subscribedUsers.includes(channel?._id)
        ? await axios.put(
            `${serverUrl}/api/users/unsub/${channel?._id}`,
            {},
            {
              withCredentials: true,
            }
          )
        : await axios.put(
            `${serverUrl}/api/users/sub/${channel?._id}`,
            {},
            {
              withCredentials: true,
            }
          );
      dispatch(subscription(channel?._id));
    } catch (error) {
      console.log("Error subscribing/unsubscribing:", error);
    }
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Tittle>{currentVideo?.title}</Tittle>
        <Detail>
          <Info>
            {currentVideo?.views} views • {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <LikeIconFilled />
              ) : (
                <LikeIconOutlined />
              )}
              <span> {currentVideo?.likes?.length}</span>
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <DislikeIconFilled />
              ) : (
                <DislikeIconOutlined />
              )}{" "}
              <span> Dislike</span>
            </Button>
            <Button>
              <ShareIcon /> <span> Share</span>
            </Button>
            <Button>
              <SaveIcon />
              <span> Save</span>
            </Button>
          </Buttons>
        </Detail>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel?.img} />
            <ChannelDetail>
              <ChannelName>{channel?.name}</ChannelName>
              <ChannelCounter>
                {channel?.subscribers} subscribers
              </ChannelCounter>
              <Descripton>{currentVideo?.desc}</Descripton>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel?._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentUser?._id} />
      </Content>
      <Recommandations tags={currentVideo?.tags} />
    </Container>
  );
}

export default Video;