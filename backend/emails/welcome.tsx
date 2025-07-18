import {
    Button,
    Container,
    Heading,
    Img,
    Section,
    Text,
} from '@react-email/components'
import { BaseEmail } from './base-email'
import { FC } from 'react'

type Props = {
    name?: string
}

const WelcomeEmail: FC<Props> = ({ name }) => {
    return (
        <BaseEmail>
            <Container className="border border-solid border-border rounded my-[40px] mx-auto p-8 max-w-[465px]">
                <Section>
                    <Img
                        src="https://flagster-azure.vercel.app/flagster.png"
                        width="60"
                        height="60"
                        alt="Flagster"
                        className="my-0 mx-auto rounded-full"
                    />
                </Section>
                <Section>
                    <Heading className="text-black text-2xl font-normal p-0 text-center">
                        Welcome to {''}
                        <strong className="text-primary">Wally</strong>
                        {''} !
                    </Heading>
                    <Section>
                        <Text className="text-black text-md">
                            {name ? `Hi ${name}` : 'Hi'}, welcome to Wally. We are excited
                            to have you on board.
                        </Text>

                        <Text className="text-black text-md">
                            You are now on free plan this is great to trying out the platform.
                            Need more usage or want to try additional features ? Upgrade to
                            Pro in few clicks.
                        </Text>

                        <Button
                            className="box-border w-full rounded-[8px] bg-primary px-[12px] py-[12px] text-center font-semibold text-white"
                            href="https://react.email"
                        >
                            Go to dashboard
                        </Button>
                    </Section>
                </Section>
            </Container>
        </BaseEmail>
    )
}

export default WelcomeEmail
