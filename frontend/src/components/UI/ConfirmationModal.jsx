import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {title}</ModalHeader>
        <ModalBody>
          Are you sure you want to proceed with this action?
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" colorScheme='blue' onClick={onClose}>
            Cancel
          </Button>
          <Button variant={'ghost'} onClick={handleConfirm} ml={3}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationModal;