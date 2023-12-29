import { useTransactionManager } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Image, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { useAccount, useConnect, useDisconnect, useNetwork } from '@starknet-react/core'
import { ContentPaste, Done, Launch, Logout } from '@mui/icons-material'
import { Box, GrayElement, MainButton, MainText } from '@/components/Layout'
import { explorerContractAddress, explorerTransactionAddress, formatEpochToTime, shortenAddress } from '@/misc'

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
  const { chain } = useNetwork()

  const { clearTransactions, transactions } = useTransactionManager()

  const [copied, setCopied] = useState(false)

  const explorerLink = useMemo(() => explorerContractAddress(address, chain), [address, chain])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }, [copied])

  return (
    <>
      <MainButton onClick={onOpen}>
        <MainText className='text-white'>{address ? shortenAddress(address) : 'Connect wallet'}</MainText>
        {chain.testnet && (
          <div className='ml-2 flex items-center bg-black'>
            <MainText className='text-xs text-amber-200'>Testnet</MainText>
          </div>
        )}
      </MainButton>
      <Modal
        backdrop='blur'
        hideCloseButton
        isOpen={isOpen}
        radius='sm'
        onOpenChange={onOpenChange}
        classNames={{
          body: 'py-6',
          base: 'border border-gray-800 bg-black/60 text-[#a8b0d3]',
          header: 'gradient-border-b',
          footer: 'gradient-border-t'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <MainText gradient heading className='text-2xl'>
                  {isConnected ? 'Your account' : 'Connect your wallet'}
                </MainText>
              </ModalHeader>
              <ModalBody>
                {isConnected ? (
                  <Box col center>
                    <MainText gradient className='text-lg'>
                      {shortenAddress(address as string, 12)}
                    </MainText>
                    <Box col className='w-[85%]'>
                      <Box spaced className='mb-2'>
                        <MainText gradient heading className='text-sm'>
                          Connected with {connector!.name}
                        </MainText>
                        <button
                          className='ml-6 flex cursor-pointer items-center justify-center'
                          onClick={() => {
                            disconnect()
                            onClose()
                          }}
                        >
                          <Box center className='mr-1 h-4 w-4 pb-0.5'>
                            <Logout fontSize='inherit' color='error' />
                          </Box>
                          <MainText heading className='text-sm text-red-600 transition ease-in-out hover:text-red-500'>
                            Disconnect
                          </MainText>
                        </button>
                      </Box>
                      <Link href={explorerLink} target='_blank' rel='noopener noreferrer'>
                        <Box center className='mr-1 h-4 w-4 pb-0.5'>
                          <Launch fontSize='inherit' className='text-gray-200' />
                        </Box>
                        <MainText heading className='self-start'>
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
                        <Box className='mr-1 h-4 w-4 pb-0.5'>
                          {copied ? (
                            <Done fontSize='inherit' className='text-gray-200' />
                          ) : (
                            <ContentPaste fontSize='inherit' className='text-gray-200' />
                          )}
                        </Box>
                        <MainText heading className='self-start'>
                          {copied ? 'Copied!' : 'Copy address to clipboard'}
                        </MainText>
                      </Link>
                    </Box>
                    <MainText gradient heading className='mb-2 mt-6 text-2xl'>
                      Recent transactions{' '}
                      {transactions.length ? (
                        <button onClick={clearTransactions}>
                          <MainText
                            heading
                            className='ml-2 text-sm text-red-600 transition ease-in-out hover:text-red-500'
                          >
                            (Clear)
                          </MainText>
                        </button>
                      ) : (
                        ''
                      )}
                    </MainText>
                    {!transactions.length ? (
                      <span className='font-body text-xs text-amber-50 text-opacity-50'>
                        Transactions you send from the app will appear here.
                      </span>
                    ) : (
                      <div className='mt-2 max-h-[400px] w-full overflow-scroll'>
                        {transactions.map((transaction, index) => (
                          <GrayElement key={index} col className='w-full is-not-first-child:mt-6'>
                            <MainText heading gradient className='text-start text-xl'>
                              {transaction.action}
                            </MainText>
                            <MainText className='text-start text-sm'>Strategy: {transaction.strategyName}</MainText>
                            <MainText className='text-start text-sm'>
                              {formatEpochToTime(transaction.timestamp)}
                            </MainText>
                            <Link
                              href={explorerTransactionAddress(transaction.hash, chain)}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <MainText heading className='self-start'>
                                View details
                              </MainText>
                              <Box center className='ml-1 h-4 w-4 pb-0.5'>
                                <Launch fontSize='inherit' className='text-blue-500' />
                              </Box>
                            </Link>
                          </GrayElement>
                        ))}
                      </div>
                    )}
                  </Box>
                ) : (
                  connectors.map((connector, index) => (
                    <MainButton
                      key={index}
                      isDisabled={!connector.available()}
                      onClick={() => {
                        connect({ connector })
                        onClose()
                      }}
                      className='p-8'
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
                      <MainText className='text-white'>Connect with {CONNECTOR_METADATA[connector.id].name}</MainText>
                    </MainButton>
                  ))
                )}
              </ModalBody>
              {!isConnected && (
                <ModalFooter>
                  <MainText className='text-xs'>
                    By connecting your wallet to the Stargaze Finance interface or interacting with the Stargaze Finance
                    contracts, you acknowledge the experimental nature of the protocol and the potential for total loss
                    of funds deposited, and hereby accept full liability for your usage of Stargaze Finance, and that no
                    financial responsibility is placed on the protocol developers and contributors.
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
