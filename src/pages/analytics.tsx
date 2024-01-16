import Image from 'next/image'
import { Box, Container, MainText } from '@/components/Layout'

export default function NotFound() {
  return (
    <Container>
      <Box col center>
        <Box center className='relative mt-10 h-[40vw] w-[40vw] md:h-[30vw] md:w-[30vw]'>
          <Image
            alt='kitten'
            fill
            src='https://placekitten.com/400/400'
            className='gradient-dark-element rounded-xl border'
          />
        </Box>
        <MainText gradient heading className='text-2xl'>
          Coming soon
        </MainText>
        <MainText gradient>But here is a cat picture in the meantime</MainText>
      </Box>
    </Container>
  )
}
