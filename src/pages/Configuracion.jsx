import { Box, Flex, Text, Heading, VStack, Card, CardHeader, CardBody, CardFooter, IconButton, Button, Grid, GridItem} from "@chakra-ui/react";
import BarraSuperior from "../components/BarraTop/barraTop";
import Sidebar from "../components/SideBar/SideBar";
import { useToast } from '@chakra-ui/react'
import { FaPlus } from "react-icons/fa6";
import { useMoldalForm } from "../hooks/useModalForm";
import ModalForm from "../components/ModalForm/ModalForm";
import { useState } from "react";

export default function Configuracion() {
    const [titulo, setTitulo] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [id, setId] = useState(null);

    const [Mensajes, setMensajes] = useState(() => {
        try {
            const datos = localStorage.getItem("Mensajes");
            return datos ? JSON.parse(datos) : []; // Array vacío en lugar de objeto con null
        } catch (error) {
            console.error("Error al parsear Mensajes:", error);
            return [];
        }
    });
    const {statusAlert, setStatusAlert} = useMoldalForm();
    const toast = useToast();
    const [usuarios,setUsuarios]=useState([]);

    const obtenerUsuarios = async () => {
        const token = localStorage.getItem("msal_token");

        try {
            const response = await fetch("https://backend-itsa-avisos-production-ecc1.up.railway.app/api/users/all", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (!response.ok) {
              throw new Error("No autorizado o error en la API");
            }

            const data = await response.json();
            setUsuarios(data.usuarios);
            localStorage.setItem('datosAlumnos', JSON.stringify(data.usuarios));
        

            toast({
              title: "Datos actualizados",
              description: "Los datos de los alumnos han sido actualizados correctamente",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
        } catch (error) {
            toast({
              title: "Error al obtener usuarios",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
        } finally {
        }
    };
    
    const handleGuardar = (datos) => {
        try {
            if (datos.id === 0) {
                const maxId = Mensajes.reduce((max, item) => (item?.id > max ? item.id : max), 1);
                const nuevosMensajes = [...Mensajes, { ...datos, id: maxId + 1 }];
                setMensajes(nuevosMensajes);
                localStorage.setItem("Mensajes", JSON.stringify(nuevosMensajes));
            } else {
                const nuevosMensajes = Mensajes.map(mensaje => 
                    mensaje.id === datos.id ? 
                    { ...mensaje, titulo: datos.titulo, cuerpo: datos.cuerpo } 
                    : 
                    mensaje
                );
                setMensajes(nuevosMensajes);
                localStorage.setItem("Mensajes", JSON.stringify(nuevosMensajes));
            }
        } catch (error) {
            console.error("Error al guardar mensaje:", error);
        }
    }

    const handleNew = () => {
        setTitulo("");
        setCuerpo("");
        setId(null);
        setStatusAlert(true);
    }

    const handledEdit = (Titulo, Cuerpo, Id) => {
        setTitulo(Titulo);
        setCuerpo(Cuerpo);
        setId(Id);
        setStatusAlert(true);
    }

    const handleEliminar = (Id) => {
        const NuevosMensajes = Mensajes.filter(mensaje => mensaje.id !== Id);
        setMensajes(NuevosMensajes);
        localStorage.setItem("Mensajes", JSON.stringify(NuevosMensajes));
    }

    return (
        <Box backgroundColor="#F5F5FB" width="100vw" height="100vh" overflow="hidden" display="flex" flexDirection="column">
            <BarraSuperior />
            <Flex flex="1" overflow="hidden">
                <Sidebar ButtonCheck={3} />
                <Box flex="1" padding={6} height="100%" display="flex" flexDirection="column">
                    <VStack spacing={6} width="100%" align="stretch" flex="1" minHeight="0">
                        <Card width="100%" backgroundColor="#FFFFFF" borderRadius="20px" boxShadow="lg">
                            <CardHeader>
                                <Text fontSize="2xl" fontWeight="bold">Datos</Text>
                            </CardHeader>
                            <CardBody>
                                <Button colorScheme="green" onClick={obtenerUsuarios}>Actualizar</Button>
                            </CardBody>
                        </Card>
        
                        <Card width="100%" backgroundColor="#FFFFFF" borderRadius="20px" boxShadow="lg" flex="1" display="flex" flexDirection="column" minHeight="0">
                            <CardHeader>
                                <Text fontSize="2xl" fontWeight="bold">Mensajes Predeterminados</Text>
                            </CardHeader>
                            <CardBody overflowY="auto" flex="1" minHeight="0">
                                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                                    <GridItem>
                                        <Card height="250px" backgroundColor="#A30B37" borderRadius="20px" boxShadow="lg">
                                            <CardHeader display="flex" justifyContent="center" alignItems="center" height="100%">
                                                <IconButton 
                                                    size="lg" 
                                                    icon={<FaPlus />} 
                                                    backgroundColor="#FFFFFF" 
                                                    onClick={handleNew}
                                                />
                                            </CardHeader>
                                        </Card>
                                    </GridItem>
        
                                    {Mensajes.filter(mensaje => mensaje !== null).map((Mensaje) => (
                                        <GridItem key={Mensaje.id}>
                                            <Card height="250px" backgroundColor="#A30B37" borderRadius="20px" boxShadow="lg">
                                                <CardHeader>
                                                    <Heading color="white" size="md">{Mensaje.titulo}</Heading>
                                                </CardHeader>
                                                <CardBody>
                                                    <Text color="white" fontSize="sm" noOfLines={3}>{Mensaje.cuerpo}</Text>
                                                </CardBody>
                                                <CardFooter>
                                                    <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                                                        <Button justifySelf="center" width="120px" colorScheme="blue" onClick={() => handledEdit(Mensaje.titulo, Mensaje.cuerpo, Mensaje.id)}>Editar</Button>
                                                        <Button justifySelf="center" width="120px" colorScheme="red" onClick={() => handleEliminar(Mensaje.id)}>Eliminar</Button>
                                                    </Grid>
                                                </CardFooter>
                                            </Card>
                                        </GridItem>
                                    ))}
                                </Grid>
                            </CardBody>
                        </Card>
                    </VStack>
                    <ModalForm onClose={() => setStatusAlert(false)} isOpen={statusAlert} onSave={handleGuardar} Title={titulo} Body={cuerpo} Id={id} />
                </Box>
            </Flex>
        </Box>
    )
}