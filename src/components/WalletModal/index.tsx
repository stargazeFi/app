import { useEffect, useState } from 'react'
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
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { ContentPaste, Done, Launch, Logout } from '@mui/icons-material'
import { Box } from '@/components/Layout'
import { MainText } from '@/components/Text'
import { shortenAddress } from '@/misc/format'

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
  const { isConnected, address, connector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }, [copied])

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
          base: 'border border-gray-800 bg-black/75 text-[#a8b0d3]',
          header: 'gradient-border-b',
          footer: 'gradient-border-t'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <MainText heading size='2xl'>
                  {isConnected ? 'Your account' : 'Connect your wallet'}
                </MainText>
              </ModalHeader>
              <ModalBody>
                {isConnected ? (
                  <Box>
                    <MainText size='xl'>{shortenAddress(address as string, 12)}</MainText>
                    <div className='flex w-[85%] flex-col'>
                      <div className='mb-2 flex justify-between'>
                        <MainText heading size='sm'>
                          Connected with {connector!.name}
                        </MainText>
                        <button
                          className='ml-6 flex cursor-pointer items-center justify-center'
                          onClick={() => {
                            disconnect()
                            onClose()
                          }}
                        >
                          <div className='mr-1 flex h-4 w-4 items-center justify-center pb-0.5'>
                            <Logout fontSize='inherit' color='error' />
                          </div>
                          <MainText size='sm' heading className='text-red-600'>
                            Disconnect
                          </MainText>
                        </button>
                      </div>
                      <Link href={`https://starkscan.co/search/${address}`} target='_blank' rel='noopener noreferrer'>
                        <div className='mr-1 flex h-4 w-4 items-center justify-center pb-0.5'>
                          <Launch fontSize='inherit' className='text-gray-200' />
                        </div>
                        <MainText heading size='sm' className='self-start'>
                          View on StarkScan
                        </MainText>
                      </Link>
                      <Link
                        className='cursor-default'
                        onClick={() => {
                          if (!copied) {
                            navigator.clipboard.writeText(address as string)
                            setCopied(true)
                          }
                        }}
                      >
                        <div className='mr-1 flex h-4 w-4 items-center justify-center pb-0.5'>
                          {copied ? (
                            <Done fontSize='inherit' className='text-gray-200' />
                          ) : (
                            <ContentPaste fontSize='inherit' className='text-gray-200' />
                          )}
                        </div>
                        <MainText heading size='sm' className='self-start'>
                          {copied ? 'Copied!' : 'Copy address to clipboard'}
                        </MainText>
                      </Link>
                    </div>
                    <MainText heading size='2xl' className='mb-2 mt-6'>
                      Recent transactions
                    </MainText>
                    <span className='font-body text-xs text-amber-50 text-opacity-50'>
                      Transactions you send from the app will appear here.
                    </span>
                  </Box>
                ) : (
                  connectors.map((connector, index) => (
                    <Button
                      key={index}
                      radius='sm'
                      isDisabled={!connector.available()}
                      variant='bordered'
                      onClick={() => {
                        connect({ connector })
                        onClose()
                      }}
                      className='border border-gray-800 p-8'
                      startContent={
                        <div className='mr-2'>
                          <Image
                            src={CONNECTOR_METADATA[connector.id].logo}
                            width={20}
                            height={20}
                            alt={CONNECTOR_METADATA[connector.id].name}
                          />
                        </div>
                      }
                    >
                      <MainText className='text-white' size='md'>
                        Connect with {CONNECTOR_METADATA[connector.id].name}
                      </MainText>
                    </Button>
                  ))
                )}
              </ModalBody>
              {!isConnected && (
                <ModalFooter>
                  <MainText size='xs'>
                    By connecting your wallet to the Stargaze Finance interface or interacting with the Stargaze Finance
                    smart contracts, you acknowledge the experimental nature of the protocol and the potential for total
                    loss of funds deposited, and hereby accept full liability for your usage of Stargaze Finance, and
                    that no financial responsibility is placed on the protocol developers and contributors.
                  </MainText>
                  {/* <MainText size='xs'>
                    By connecting a wallet, you agree to the Stargaze Finance{' '}
                    <Link href={TERMS_OF_USE_URL} target='_blank' rel='noreferrer noopener'>
                      <u className='text-xs text-amber-50'>terms of use</u>
                    </Link>{' '}
                    and{' '}
                    <Link href={PRIVATE_POLICY_URL} target='_blank' rel='noreferrer noopener' className='underline'>
                      <u className='text-xs text-amber-50'>privacy policy</u>
                    </Link>
                    .
                  </MainText> */}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
