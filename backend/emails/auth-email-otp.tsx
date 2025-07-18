import {
    Container,
    Heading,
    Hr,
    Img,
    Section,
    Text,
} from '@react-email/components'
import { FC } from 'react'
import { BaseEmail } from './base-email'

type Props = {
    code: string
}

const AuthEmailOTP: FC<Props> & { PreviewProps: Props } = ({ code }) => {
    return (
        <BaseEmail>
            <Container className="border border-solid border-border rounded my-[40px] mx-auto p-8 max-w-[465px]">
                <Section>
                    <Img
                        src="https://www.flagster.fr/flagster.png"
                        width="60"
                        height="60"
                        alt="Flagster"
                        className="my-0 mx-auto rounded-full"
                    />
                </Section>
                <Section>
                    <Heading className="text-black text-2xl font-normal p-0">
                        Verify your email to sign in to{' '}
                        <strong className="text-primary">Wally</strong>
                    </Heading>
                    <Section>
                        <Text className="text-black text-md">
                            To complete the sign-in process enter the 6-digit code in the
                            original window.
                        </Text>
                    </Section>
                </Section>
                <Section className="bg-secondary text-center">
                    <Text className="text-primary text-2xl">{code}</Text>
                </Section>
                <Hr className="mt-4" />
                <Text className="text-muted-foreground text-md">
                    If you didn't attempt to sign in but received this email, please
                    ignore this email. Don't share or forward the 6-digit code with
                    anyone. Our customer service will never ask for it. Do not read this
                    code out loud.
                </Text>
            </Container>
        </BaseEmail>
    )
}

AuthEmailOTP.PreviewProps = {
    code: '123456',
}

export default AuthEmailOTP
