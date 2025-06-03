import { Box,Flex,VStack,HStack,Table,TableContainer,TableCaption,Thead,Tbody,Tr,Th,Td,IconButton,Text } from "@chakra-ui/react";
import BarraSuperior from "../components/BarraTop/barraTop"
import  Sidebar  from "../components/SideBar/SideBar";
import { GoArrowLeft,GoArrowRight } from "react-icons/go";
import { useState,useRef } from "react";
export default function Alumnos(){

    const datosAlumnos =localStorage.getItem('datosAlumnos');
    const datosAlumnosJSON = JSON.parse(datosAlumnos);
    const [Index, setIndex] = useState(1);
    const tableContainerRef=useRef(false);

    const handleNextPage = () => {
        if (Index < Math.ceil(datosAlumnosJSON.length / 100)) {
            setIndex(Index + 1);
            scrollToTop();
        }
    }

    const handlePrevPage = () => {
        if (Index > 1) {
            setIndex(Index - 1);
            scrollToTop();
        }
    }

    const scrollToTop = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({
                top: 0,
                behavior: "smooth" // Para un efecto de desplazamiento suave
            });
        }
    }
    return( 
        <Box 
        backgroundColor="#F5F5FB"
        width="100vw" 
        height="100vh" 
        overflow="hidden"
        display="flex" 
        flexDirection="column"
        >   
            <BarraSuperior />
            <Flex>
                <Sidebar ButtonCheck={2}/>
                <Box width="100vw" height="100vh" display="flex">   
                    <VStack spacing={4} align="stretch" width="100%" height="85%"  alignItems="center" margin={5} overflowY={'auto'}> 
                        <TableContainer width="100%" height="90vh" overflowY={'auto'} ref={tableContainerRef}>
                          <Table variant='striped' colorScheme='red'>
                            <TableCaption>Destinatarios</TableCaption>
                            <Thead>
                              <Tr>
                                <Th>indice</Th>
                                <Th>Nombre del alumno</Th>
                                <Th>Correo</Th>
                                <Th>Carrera</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                                {datosAlumnosJSON.map((alumno) => (
                                    // Filtrar los alumnos según el índice de la página actual
                                    alumno.id>(0+100*(Index-1)) && alumno.id<=(100*Index) ? (
                                        <Tr key={alumno.id}>
                                            <Td>{alumno.idUser}</Td>
                                            <Td>{alumno.displayName}</Td>
                                            <Td>{alumno.mail}</Td>
                                            <Td>{alumno.Carrera}</Td>
                                        </Tr>
                                    ): null
                                ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                        <HStack width="100%" height="10vh" display="flex" justifyContent="center" alignItems="center" spacing={10}>
                                <IconButton
                                    icon={<GoArrowLeft/>}
                                    width="5%"
                                    height="80%"
                                    colorScheme="red"
                                    variant={"solid"}
                                    onClick={handlePrevPage}
                                ></IconButton>
                                 <IconButton
                                    icon={<GoArrowRight/>}
                                    width="5%"
                                    height="80%"
                                    colorScheme="red"
                                    variant={"solid"}
                                    onClick={handleNextPage}
                                ></IconButton>
                        </HStack>
                        <Box width="100%" height="5vh" display="flex" justifyContent="center" alignItems="center" >
                            <Text>Pagina {Index} de {Math.ceil(datosAlumnosJSON.length/100)}</Text>
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    )
}

