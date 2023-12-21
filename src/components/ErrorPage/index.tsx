import Image from 'next/image'
import { Box, Container, MainText } from '@/components/Layout'

export default function ErrorPage() {
  const rng = Math.floor(Math.random() * 10) + 1
  const image = rng === 10 ? '/assets/general/error-pepe.png' : `/assets/general/error-${(rng % 3) + 1}.png`

  return (
    <Container>
      <Box col center>
        <Box className='relative mt-10 h-[40vw] w-[40vw] md:h-[30vw] md:w-[30vw]'>
          <Image src={image} fill alt={image} />
        </Box>
        <MainText gradient heading size='2xl'>
          Error
        </MainText>
        <MainText gradient>It seems the app has encountered an error. Try to refresh or come back later.</MainText>
      </Box>
    </Container>
  )
}
