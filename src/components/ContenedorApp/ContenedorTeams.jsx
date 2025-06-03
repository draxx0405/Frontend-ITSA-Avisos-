import {
    Box,Text,Flex,Grid,Checkbox,CheckboxGroup,
    Stack,Heading,Button,Textarea,FormLabel
    ,Card,useDisclosure,
    VStack,Input
} from "@chakra-ui/react";
import FileUpload from "../drag and drop archivos/DragAndDrop";
import { IoIosSend } from "react-icons/io";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ModalView from "./../ModalView/ModalView" ;
import CardBox from "./../CardBox/CardBox"

export default function ContenedorTeams() {

  const mensajes=JSON.parse(localStorage.getItem('Mensajes'));
  const usuarios=JSON.parse(localStorage.getItem('datosAlumnos'));
  const [usuariosFiltrados,setUsuariosFiltrados]=useState([]);
  const [carreras, setCarreras] = useState([
      {id: 1, Carrera: "Ing. Industrial", Estado: false, clave: "D"},
      {id: 2, Carrera: "Ing. Electrómecanica", Estado: false, clave: "T"},
      {id: 3, Carrera: "Ing. Sistemas", Estado: false, clave: "S"},
      {id: 4, Carrera: "Ing. Gestión", Estado: false, clave: "G"},
      {id: 5, Carrera: "Ing. Mecatrónica", Estado: false, clave: "K"}
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [file,setFile]=useState([]|undefined);
  const handleSelectFile = (files) => {
    if (files) {
      setFile(files); 
    } else {
      setFile(null);
    }
  };
  const [mensaje, setMensaje] = useState({ id: null, titulo: "", cuerpo: "" });
  
  const setMensajeTitulo = (titulo) => {
    setMensaje(prev => ({ ...prev, titulo }));
  };

  const setMensajeTexto = (cuerpo) => {
    setMensaje(prev => ({ ...prev, cuerpo }));
  };
 
  
  const handleCarrerasCheck = (event) => {
    const { value, checked } = event.target;
    const nuevasCarreras = carreras.map((carrera) => {
        if (carrera.Carrera === value) {
            return { ...carrera, Estado: checked };
        }
        return carrera;
    });
    setCarreras(nuevasCarreras);
      // Filtrar usuarios solo si hay carreras seleccionadas
    const carrerasSeleccionadas = nuevasCarreras
      .filter(c => c.Estado)
      .map(c => c.clave);

    if (carrerasSeleccionadas.length === 0) {
        setUsuariosFiltrados(usuarios);
    } else {
        const filtrados = usuarios.filter(user => {
            // Asegurarse que user.matricula existe y tiene al menos 5 caracteres
            if (!user.matricula || user.matricula.length < 5) return false;
            const letraCarrera = user.matricula[4].toUpperCase();
            return carrerasSeleccionadas.includes(letraCarrera);
        });
        setUsuariosFiltrados(filtrados);
    }
  };
  
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof Blob)) {
        reject(new Error("Archivo no válido"));
        return;
      }
    
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const sendMessageWithAttachment = async (users, message) => {
    try {
      // Validaciones
      if (!users?.length) throw new Error("No hay usuarios seleccionados");
      if (!message?.trim()) throw new Error("El mensaje no puede estar vacío");
      if (!file) throw new Error("No se ha seleccionado archivo");
    
      // Convertir archivo a base64
      const base64File = await fileToBase64(file);
    
      // Extraer IDs de usuario
      const userIds = users.map((user) => user.idUser);
    
      const token = localStorage.getItem('msal_token');
      if (!token) throw new Error("No se encontró token de autenticación");
    
      // Hacer una sola petición al backend
      const response = await fetch("http://localhost:8000/api/teams/send-message-with-attachment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: userIds,
          message: message,
          file: base64File,
          file_name: file.name
        })
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.detail || "Error al enviar mensajes");
      }
    
      // Formatear resultados
      const results = data.results.map((result) => {
        const user = users.find((u) => u.idUser === result.user_id);
        return {
          user: user?.displayName || result.user_id,
          success: result.status === "success",
          messageId: result.message_id,
          chatId: result.chat_id
        };
      });
    
      return {
        status: "completed",
        results: results
      };
    
    } catch (error) {
      console.error("Error en sendMessageWithAttachment:", error);
      throw error;
    }
  };
  const EnviarMensaje = async (usuarios, Mensaje) => {
    const token = localStorage.getItem('msal_token');
    if (!token) {
        return;
    }
    try {
          
        for (const user of usuarios) {
            const response = await fetch("http://localhost:8000/api/teams/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user.idUser,
                    message: Mensaje
                })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(`Error al enviar mensaje: ${data.detail?.error || data.detail || "Error desconocido"}`);
                return;
            }
            console.log("✅ Mensaje enviado:", data);
        }
    } catch (err) {
        console.error("❌ Error al enviar mensaje:", err);
    }
  };

  const handleClick = () => {
    if (usuariosFiltrados.length === 0) {
        console.warn("No hay usuarios seleccionados");
        alert("Por favor selecciona al menos una carrera");
        return;
    }
    
    if(file){
      console.info("mensaje con archivo");
      sendMessageWithAttachment(usuariosFiltrados, mensaje.cuerpo);
    }else{
        EnviarMensaje(usuariosFiltrados, mensaje.cuerpo);
    }
  };

  const handleElegirMensaje = (mensajeSeleccionado) => {
    setMensaje({
      id: mensajeSeleccionado.id,
      titulo: mensajeSeleccionado.titulo,
      cuerpo: mensajeSeleccionado.cuerpo
    });
  };

 return (
      <Flex
          flexDirection="column"
          height="100vh"
          width="100%"
          margin={5}
          overflowY={"auto"}
      >
        <Card
          width="100%"
          backgroundColor="#A30B37"
          borderRadius={20}
          mb={5}
          padding={4}
        >
          <Heading color="white" size="3xl" mb={5}>Carreras</Heading>
          <Text color="white" fontSize="2xl" mb={5}>¿A quien desea enviar el mensaje?</Text>
          <Box justifyContent="center" width="100%" display="flex">
            <CheckboxGroup colorScheme='whiteAlpha'>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
                {carreras.map((carrera) =>(
                  <Checkbox sx={{  
                    ".chakra-checkbox__label": { fontSize: "20px", color: "white" },
                    ".chakra-checkbox__control": {
                      width: "20px",          
                      height: "20px",        
                      borderWidth: "2px",   
                    },
                    ".chakra-checkbox__control svg": {
                      width: "15px",         
                      height: "15px",
                    }}} 
                    color="white" key={carrera.id} value={carrera.Carrera} onChange={handleCarrerasCheck}>{carrera.Carrera}</Checkbox>
                    ))}
              </Stack>
            </CheckboxGroup>
          </Box>
        </Card>
        
        <Box
          backgroundColor="#A30B37"
          borderRadius={20}
          padding={4}
          width="100%"
        >
              
          <Heading size="lg" color="white" mb={5}>Cuerpo del mensaje</Heading>
          <Grid templateColumns="65% 30%" gap={4}>
              <Box margin={5}>
                  <VStack spacing={5}>
                    <Input 
                      height={"40px"} 
                      placeholder="Escribe el titulo del mensaje..."
                      value={mensaje.titulo}
                      onChange={(e) => setMensajeTitulo(e.target.value)} 
                      _placeholder={{color:'white'}}
                      color={'white'}
                    />
                    <FormLabel htmlFor="message" srOnly>Cuerpo del mensaje</FormLabel>
                    <Textarea 
                      id="message"
                      height="200px"
                      placeholder="Escribe tu mensaje aquí..."
                      color="white"
                      _placeholder={{color:'white'}}
                      resize="none"
                      value={mensaje.cuerpo}
                      onChange={(e) => setMensajeTexto(e.target.value)}/>
                  </VStack>
              </Box>
              <FileUpload onSave={handleSelectFile}/>
          </Grid>
          <Box
              padding={5}
              display="flex"
              justifyContent="space-between"
              width="100%"
          >
            <Box display="flex" justifyContent="space-between" width="64%">
                <Button height="50px" aria-label="Borrar mensaje" color="black" leftIcon={<FaDeleteLeft />}>Borrar Mensaje</Button>
                <Button height="50px" aria-label="Seleccionar mensaje" color="black" leftIcon={<FaMessage />} colorScheme="yellow" onClick={onOpen}>Seleccionar Mensaje</Button>
            </Box>
            <Button height="50px" aria-label="Enviar mensaje" colorScheme="green" leftIcon={<IoIosSend color="white" size={20}/>} onClick={handleClick} >Enviar Mensaje</Button>
          </Box>
        </Box>

        <ModalView title="Seleecciona el mensaje" onClose={onClose} isOpen={isOpen} children={
          <VStack overflowY="auto" spacing={5} align="start" width="100%">
            {mensajes!==null && mensajes.map((mensaje) => (
              <CardBox
                key={mensaje.id}
                width="600px"
                height="250px"
                bgColor="#A30B37"
                content={
                  <VStack spacing={5} align="start" width="100%" height="100%">
                    <Text color="white" fontSize="18px">{mensaje.titulo}</Text>
                    <Text color="white" fontSize="14px" flex="1">{mensaje.cuerpo}</Text>
                
                    <Flex justify="flex-end" width="100%">
                      <Button
                        variant="solid"
                        colorScheme="blue"
                        onClick={() => {
                          handleElegirMensaje(mensaje);
                          onClose();
                        }}
                      >
                        Elegir mensaje
                      </Button>
                    </Flex>
                  </VStack>
                }
              />

          ))}
      </VStack>
        } />
    </Flex>
  );
}