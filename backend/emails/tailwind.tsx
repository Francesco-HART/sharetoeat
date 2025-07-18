import { Tailwind as ReactTailwind } from '@react-email/tailwind'
import { FC, PropsWithChildren } from 'react'
const tailwindConfig = require('../tailwind.config.cjs')

export const Tailwind: FC<PropsWithChildren> = ({ children }) => {
  return <ReactTailwind config={tailwindConfig}>{children}</ReactTailwind>
}
