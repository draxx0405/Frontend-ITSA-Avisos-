import React from 'react';
import { Box, Flex, Stack, Button, Icon, Text, Image } from '@chakra-ui/react';
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Iconos de React Icons
import { PiMicrosoftTeamsLogoLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

function Sidebar({ButtonCheck}) {
  const navigate = useNavigate();

  const handleCerrarSesion=()=>{
    const logoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=https://d10gzc4g-5173.usw3.devtunnels.ms/`;
    window.location.href = logoutUrl;
  }
  
  return (
    <Box
      width="250px"
      height="100vh"
      backgroundColor="white"
      boxShadow="md"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        padding={4}
      >
        <Image 
            src="../../../public/ITSA.png"
            alt="Itsa Logo"
            width={["100%", "50%", "180px"]}
            height={["100%", "30%", "60px"]}
        />
      </Flex>

      {/* Opciones del menú */}
      <Stack spacing={2} padding={4}>
    
        <Button
          leftIcon={<Icon as={PiMicrosoftTeamsLogoLight} width={6} height={6} />}
          variant="ghost"
          backgroundColor={ButtonCheck === 1 ? "red" : undefined}
          color={ButtonCheck === 1 ? "white" : undefined}
          justifyContent="flex-start"
          onClick={()=>navigate('/Teams') }
        >
          Teams
        </Button>

        <Button
          leftIcon={<Icon as={FaUser} />}
          variant="ghost"
          justifyContent="flex-start"
          backgroundColor={ButtonCheck === 2 ? "red" : undefined}
          color={ButtonCheck === 2 ? "white" : undefined}
          onClick={()=> navigate('/Alumnos')}
        >
          Alumnos
        </Button>

        <Button
          leftIcon={<Icon as={FaCog} />}
          variant="ghost"
          justifyContent="flex-start"
          backgroundColor={ButtonCheck === 3 ? "red" : undefined}
          color={ButtonCheck === 3 ? "white" : undefined}
          onClick={()=>navigate('/Configuracion')}
        >
          Configuración
        </Button>

        <Button
          leftIcon={<Icon as={FaSignOutAlt} />}
          variant="ghost"
          justifyContent="flex-start"
          colorScheme="red"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </Button>
      </Stack>
    </Box>
  );
}

export default Sidebar;