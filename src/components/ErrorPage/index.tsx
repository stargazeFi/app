import { Box, Container, MainText } from '@/components/Layout'

export const ErrorPage = ({ errMessage }: { errMessage?: string }) => {
  return (
    <Container>
      <Box col center className='h-[80vh]'>
        <MainText gradient heading className='text-2xl'>
          ERROR
        </MainText>
        <MainText gradient>
          {errMessage || 'It seems the app has encountered an error. Try to refresh or come back later.'}
        </MainText>
      </Box>
    </Container>
  )
}
