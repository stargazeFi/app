import { Box, Container } from '@/components/Layout'
import { MainText } from '@/components/Text'
import { Image } from '@nextui-org/react'

export default function Home() {
  const rng = Math.floor(Math.random() * 10) + 1
  const image = rng === 10 ? '/assets/general/error-pepe.png' : `/assets/general/error-${(rng % 3) + 1}.png`

  return (
    <Container>
      <Box>
        <Image src={image} className='mt-10 h-[40vw] w-auto md:h-[30vw]' />
        <MainText heading size='2xl'>
          Page not found
        </MainText>
        <MainText>The page you requested does not exist</MainText>
      </Box>
    </Container>
  )
}
