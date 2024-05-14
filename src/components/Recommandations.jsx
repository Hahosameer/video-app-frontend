
import styled from 'styled-components';
import axios from "axios";
import Card from './Card.jsx';
import { useEffect, useState } from 'react';


const Container = styled.div`
flex: 2;
`;
function Recommandations({tags}) {
    const [videos, setVideos] = useState([]);
    useEffect(()=>{
        const fetchVideos = async ()=>{
            const res = await axios.get(`https://bright-lime-butterfly.cyclic.app/api/videos/tags?tags=${tags}`,{},{
                withCredentials: true,
            });
            setVideos(res.data)
            console.log("resVideos",res.data);
        };
        fetchVideos()
    },[tags])


  return (
    <Container>
        {videos.map((video) => (
         <Card type='sm' key={video._id} video={video}/>
        ))}
    </Container>
  )
}

export default Recommandations