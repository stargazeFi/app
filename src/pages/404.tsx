import { Box, Container, MainText } from '@/components/Layout'

export default function NotFound() {
  return (
    <Container>
      <Box col center className='h-[80vh]'>
        <MainText gradient heading className='text-2xl'>
          PAGE NOT FOUND
        </MainText>
        <MainText gradient>The page you requested does not exist</MainText>
      </Box>
    </Container>
  )
}
