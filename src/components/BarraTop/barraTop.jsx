import {Box, Heading, Image} from "@chakra-ui/react";

export default function BarraSuperior(){
    
    return(
        <Box 
            backgroundColor="#A30B37" 
            padding={5}
            display="flex"
            minWidth="100%" 
            width="100vw" 
            alignItems="center"
            justifyContent="space-between" 
            gap={10}
            >
                
                <Box justifyContent="left" alignItems="center" display="flex">
                    <Heading color="White" ml={15}>ITSA Avisos</Heading>
                </Box>

                <Box justifyContent="right">
                    <Heading  color="white" size="md">
                    </Heading>
                </Box>

        </Box>
    );
}