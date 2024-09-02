import React from "react";

// Chakra imports
import { Flex, Text, /* useColorModeValue */ } from "@chakra-ui/react";

// Custom components
// import { HorizonLogo } from "components/icons/Icons";
import { HSeparator, VSpace } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  // let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <Text as='b' fontSize='3xl'>Admin Portal</Text>
      <VSpace mb='20px'/>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
