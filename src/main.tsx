import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import StarknetConfigWrapper from '@/StarknetConfigWrapper'
import App from '@/App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <StarknetConfigWrapper> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </StarknetConfigWrapper> */}
    </QueryClientProvider>
  </StrictMode>
)
