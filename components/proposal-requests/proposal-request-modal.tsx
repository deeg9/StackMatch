"use client"

import { useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react"

const ProposalRequestModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real application, you would send the data to your backend here
      console.log("Proposal Request Data:", { name, email, description })

      toast({
        title: "Proposal Request Sent",
        description: "Your proposal request has been sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      onClose()
      setName("")
      setEmail("")
      setDescription("")
    } catch (error) {
      console.error("Error sending proposal request:", error)
      toast({
        title: "Error Sending Proposal Request",
        description: "There was an error sending your proposal request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Proposal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl id="email" isRequired mt={4}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="description" mt={4}>
            <FormLabel>Project Description</FormLabel>
            <Textarea
              placeholder="Describe your project requirements"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="green"
            isLoading={isLoading}
            onClick={handleSubmit}
            isDisabled={!name || !email}
          >
            {isLoading ? <Spinner size="sm" /> : "Send Proposal Request"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProposalRequestModal
