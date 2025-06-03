import { Box } from '@chakra-ui/react';
import BarraSuperior from '../components/BarraTop/barraTop';
import Sidebar from '../components/SideBar/SideBar';
export default function Inicio() {
  
     return( 
        <Box 
        backgroundColor="#F5F5FB"
        width="100vw" 
        height="100vh" 
        overflow="hidden"
        >   
            <BarraSuperior />
            <Box>
            <Sidebar ButtonCheck={0}/>
            
            </Box>
        </Box>
    )
}
