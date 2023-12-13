import { Box, Container } from '@/components/Layout'
import { MainText } from '@/components/Text'
import { Image } from '@nextui-org/react'

export default function Home() {
  return (
    <Container>
      <Box>
        <Image
          src={`/assets/general/error-${Math.floor(Math.random() * 3) + 1}.png`}
          className='mt-10 h-[40vw] w-auto md:h-[30vw]'
        />
        <MainText heading size='2xl'>
          Page not found
        </MainText>
        <MainText>The page you requested does not exist</MainText>
      </Box>
    </Container>
  )
}
