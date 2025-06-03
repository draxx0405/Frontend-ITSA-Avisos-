import { Box, Text, Icon, CloseButton } from "@chakra-ui/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi"; 

function FileUpload({ onSave }) {
    const [file, setFile] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const selectedFile = acceptedFiles[0];
                setFile(selectedFile);
                onSave(selectedFile);
            }
        },
        multiple: false,
    });

    const removeFile = () => {
        setFile(null);
        onSave(null);
    };

    return (
        <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor={isDragActive ? "white" : "gray.200"}
            borderRadius="md"
            p={6}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ borderColor: "white" }}
        >
            <input {...getInputProps()} />
            
            {file ? (
                <Box>
                    <Text fontSize="lg" color="white">
                        Archivo seleccionado:
                    </Text>
                    <Text fontSize="md" color="white" mt={2}>
                        {file.name}
                    </Text>
                    <CloseButton 
                        size="sm" 
                        color="white" 
                        mt={2}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                    />
                </Box>
            ) : (
                <>
                    <Icon as={FiUploadCloud} w={8} h={8} mb={2} color="white" />
                    <Text fontSize="lg" color="white">
                        {isDragActive
                            ? "Suelta el archivo aquí"
                            : "Arrastra y suelta un archivo aquí"}
                    </Text>
                    <Text fontSize="sm" color="white">
                        o haz clic para seleccionar un archivo
                    </Text>
                </>
            )}
        </Box>
    );
}

export default FileUpload;