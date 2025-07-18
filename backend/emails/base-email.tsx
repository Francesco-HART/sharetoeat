import { Body, Html } from '@react-email/components'
import { FC, PropsWithChildren } from 'react'
import { Tailwind } from './tailwind'

export const BaseEmail: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Html lang="en">
      <Tailwind>
        <Body className="font-sans">{children}</Body>
      </Tailwind>
    </Html>
  )
}
