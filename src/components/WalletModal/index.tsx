import { useTransactionManager } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { useAccount, useConnect, useDisconnect, useNetwork } from '@starknet-react/core'
import { ContentPaste, Done, Launch, Logout } from '@mui/icons-material'
import { Box, MainButton, MainText, SecondaryText } from '@/components/Layout'
import { explorerContractURL, explorerTransactionURL, formatEpochToDate, shortenAddress } from '@/misc'

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

  const explorerLink = useMemo(() => explorerContractURL(address, chain), [address, chain])

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
        <MainText heading className='text-white'>
          {address ? shortenAddress(address) : 'Connect wallet'}
        </MainText>
        {chain.testnet && (
          <div className='ml-2 flex items-center'>
            <MainText heading className='text-amber-200'>
              Testnet
            </MainText>
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
          base: 'border border-gray-800 bg-[#121212]',
          header: 'gradient-fire-b',
          footer: 'gradient-fire-t'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <MainText heading className='text-2xl text-white'>
                  {isConnected ? 'YOUR ACCOUNT' : 'CONNECT YOUR WALLET'}
                </MainText>
              </ModalHeader>
              <ModalBody>
                {isConnected ? (
                  <Box col center>
                    <MainText heading className='text-lg text-white'>
                      {shortenAddress(address as string, 12)}
                    </MainText>
                    <Box col className='w-[85%]'>
                      <Box spaced className='mb-2'>
                        <MainText className='text-sm text-white'>Connected with {connector!.name}</MainText>
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
                            DISCONNECT
                          </MainText>
                        </button>
                      </Box>
                      <Link href={explorerLink} target='_blank' rel='noopener noreferrer'>
                        <Box center className='mr-1 h-4 w-4'>
                          <Launch fontSize='inherit' className='text-gray-200' />
                        </Box>
                        <MainText className='self-start text-palette4'>View on StarkScan</MainText>
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
                        <MainText className='self-start text-palette4'>
                          {copied ? 'Copied!' : 'Copy address to clipboard'}
                        </MainText>
                      </Link>
                    </Box>
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
              <ModalFooter>
                {!isConnected ? (
                  <SecondaryText className='!text-center text-xs'>
                    By connecting your wallet to the Stargaze Finance interface or interacting with the Stargaze Finance
                    contracts, you acknowledge the experimental nature of the protocol and the potential for total loss
                    of funds deposited, and hereby accept full liability for your usage of Stargaze Finance, and that no
                    financial responsibility is placed on the protocol developers and contributors.
                  </SecondaryText>
                ) : (
                  <Box center col className='w-full'>
                    <MainText heading className='mb-2 text-2xl text-white'>
                      RECENT TRANSACTIONS{' '}
                      {!!transactions.length && (
                        <button onClick={clearTransactions}>
                          <MainText heading className='text-sm text-red-600 transition ease-in-out hover:text-red-500'>
                            (CLEAR)
                          </MainText>
                        </button>
                      )}
                    </MainText>
                    {!transactions.length ? (
                      <MainText className='font-body text-sm text-white text-opacity-50'>
                        Transactions you send from the app will appear here.
                      </MainText>
                    ) : (
                      <div className='mt-2 max-h-[400px] w-full overflow-scroll'>
                        {transactions.map((transaction, index) => (
                          <Box key={index} col className='w-full is-not-first-child:mt-6'>
                            <MainText heading className='text-start text-xl uppercase text-white'>
                              {transaction.action}
                            </MainText>
                            <MainText gradient className='text-start text-sm'>
                              Strategy: {transaction.strategyName}
                            </MainText>
                            <MainText gradient className='text-start text-sm'>
                              {formatEpochToDate(transaction.timestamp)}
                            </MainText>
                            <Link
                              href={explorerTransactionURL(transaction.hash, chain)}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <Box center className='mr-1 h-4 w-4'>
                                <Launch fontSize='inherit' className='text-gray-200' />
                              </Box>
                              <MainText className='self-start text-palette4'>View on StarkScan</MainText>
                            </Link>
                          </Box>
                        ))}
                      </div>
                    )}
                  </Box>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
