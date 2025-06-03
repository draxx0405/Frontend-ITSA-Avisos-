import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Heading,
    VStack,
    Input,
    Textarea,
    Box
  } from '@chakra-ui/react'
import {useState,useEffect} from 'react'

export default function ModalForm({ isOpen,onClose, onSave,Title,Body,Id }) {
  const [titulo,setTitulo]=useState("");
  const [cuerpo,setCuerpo]=useState("");
  const [id,setid]=useState(0);

  useEffect(() => {
    if (isOpen) {
      setTitulo(Title || "");
      setCuerpo(Body || "");
      setid(Id || 0);
    }
  }, [isOpen, Title, Body,id]);

  const handleGuardar= ()=>{
    onSave({id,titulo,cuerpo});
    onClose();
  }

  const handleTitluloChange=(event)=>{
    setTitulo(event.target.value);
  }
  const handleCuerpoChange=(event)=>{
    setCuerpo(event.target.value);
  }

  return (
    <Box>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo mensaje</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Heading fontSize={"2xl"}>Titulo del mensaje</Heading>
                <Input placeholder='Escribe aqui el titulo' fontSize={"medium"} onChange={handleTitluloChange} value={titulo} />
                <Heading fontSize={"2xl"}>Cuerpo del mensaje</Heading>
                <Textarea placeholder='Escribre aqui el cuerpo del mensaje' fontSize={"medium"} height="250px" resize="none" onChange={handleCuerpoChange} value={cuerpo}/>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={handleGuardar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}