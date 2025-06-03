import { Box, Text } from "@chakra-ui/react";

interface CardProps {
  width?: number | string,
  height?: number | string,
  bgColor?: string,
  radius?: number,
  padding?: number,
  content: React.ReactNode,

}

const CardBox: React.FC<CardProps> = ({
  bgColor = "white",
  radius = 15,
  padding = 20,
  width = 200,
  height = 300,
  content = <Text>Holaa</Text>,
 
}) => {
  return (
    <Box
      backgroundColor={bgColor}
      borderRadius={radius}
      padding={padding.toString().concat('px')}
      width={width}
      height={height}
      boxShadow="md"
    >
      {content}
    </Box>
  );
};

export default CardBox;
