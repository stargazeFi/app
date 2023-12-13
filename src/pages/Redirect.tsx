import { useRedirectTo } from '@/hooks/useRedirectTo'

export function RedirectTo({ pathname }: { pathname: string }) {
  useRedirectTo({ pathname })

  return null
}
