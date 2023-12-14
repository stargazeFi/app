import Image from 'next/image'
import { Box, Container } from '@/components/Layout'
import { MainText } from '@/components/Text'

export default function Home() {
  const rng = Math.floor(Math.random() * 10) + 1
  const image = rng === 10 ? '/assets/general/error-pepe.png' : `/assets/general/error-${(rng % 3) + 1}.png`

  return (
    <Container>
      <Box col center>
        <Box className='relative mt-10 h-[40vw] w-[40vw] md:h-[30vw] md:w-[30vw]'>
          <Image src={image} fill alt={image} />
        </Box>
        <MainText gradient heading size='2xl'>
          Page not found
        </MainText>
        <MainText gradient>The page you requested does not exist</MainText>
      </Box>
    </Container>
  )
}
