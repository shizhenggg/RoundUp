import React from "react";
import { Container, Text, Heading } from "native-base";

export default function ShowPageCard({ heading, body }) {
  return (
    <Container borderColor="coolGray.200" borderWidth="1" width="90%" p="4" bgColor="#fff">
      <Text fontSize="md" fontWeight="medium">
        {heading}
      </Text>
      <Text fontSize="lg" mt="1" fontWeight="bold">
        {body}
      </Text>
    </Container>
  );
}