import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import { useAccount, useConnect } from '@starknet-react/core'
import { MainText } from '@/components/Text'
import { PRIVATE_POLICY_URL, TERMS_OF_USE_URL, shortenAddress } from '@/misc'

const CONNECTOR_METADATA: {
  [id: string]: { name: string; logo: string }
} = {
  argentX: {
    name: 'ArgentX',
    logo: '/assets/general/argent.svg'
  },
  argentMobile: {
    name: 'Argent Mobile',
    logo: '/assets/general/argent-mobile.svg'
  },
  braavos: {
    name: 'Braavos',
    logo: '/assets/general/braavos.svg'
  }
}

export default function WalletModal() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} radius='sm' variant='bordered' className='border border-gray-500'>
        <MainText size='md'>{address ? shortenAddress(address) : 'Connect wallet'}</MainText>
      </Button>
      <Modal
        backdrop='blur'
        hideCloseButton
        isOpen={isOpen}
        radius='sm'
        onOpenChange={onOpenChange}
        classNames={{
          body: 'py-6',
          base: 'border border-gray-800 bg-transparent dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'gradient-border-b',
          footer: 'gradient-border-t'
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <MainText heading size='2xl'>
                  {isConnected ? 'Wallet' : 'Connect your wallet'}
                </MainText>
              </ModalHeader>
              <ModalBody>
                {connectors.map((connector, index) => (
                  <Button
                    key={index}
                    radius='sm'
                    isDisabled={!connector.available()}
                    variant='bordered'
                    onClick={() => connect({ connector })}
                    className='border border-gray-800 p-8'
                    startContent={
                      <Image
                        src={CONNECTOR_METADATA[connector.id].logo}
                        width={20}
                        height={20}
                        alt={CONNECTOR_METADATA[connector.id].name}
                        className='mr-2'
                      />
                    }
                  >
                    <MainText className='text-white' size='md'>
                      Connect with {CONNECTOR_METADATA[connector.id].name}
                    </MainText>
                  </Button>
                ))}
              </ModalBody>
              {!isConnected && (
                <ModalFooter>
                  <MainText size='xs'>
                    By connecting a wallet, you agree to the Stargaze Finance{' '}
                    <Link href={TERMS_OF_USE_URL} target='_blank' rel='noreferrer noopener'>
                      <u className='text-amber-50'>terms of use</u>
                    </Link>{' '}
                    and{' '}
                    <Link href={PRIVATE_POLICY_URL} target='_blank' rel='noreferrer noopener' className='underline'>
                      <u className='text-amber-50'>privacy policy</u>
                    </Link>
                    .
                  </MainText>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
