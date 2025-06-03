import { Box } from "@chakra-ui/react";
import BarraSuperior from "../components/BarraTop/barraTop";
import Sidebar from "../components/SideBar/SideBar";
import ContenedorTeams from '../components/ContenedorApp/ContenedorTeams'

export default function App() {

  return (
    <Box 
    backgroundColor="#F5F5FB"
    width="100vw" 
    height="100vh" 
    overflow="hidden"
    >   
        <BarraSuperior />
        <Box display='flex'>
          <Sidebar ButtonCheck={1}/>
            <ContenedorTeams />
        </Box>
    </Box>
  );
}
