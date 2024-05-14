import Card from "../../components/Card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
display: flex;
justify-content: space-between;
flex-wrap: wrap;

`;

function Home({type}) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${type}`);
        setVideos(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <Card  key={video._id}  video={video}/>
      ))}
    </Container>
  );
}

export default Home;
