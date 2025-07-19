import { AggregateRoot } from "@app/core/domain/entities/aggregate-root"

type Props = {
    id: string
    code: string
    shopId: string
    isInWallet: boolean
    createdAt: Date
}

type CreateProps = Omit<Props, "createdAt" | "isInWallet"> & {
    currentDate: Date
}

export type LoyaltyCardSnapshot = LoyaltyCard["snapshot"]

export class LoyaltyCard extends AggregateRoot<Props> {
    get id(): string {
        return this.props.id
    }

    get shopId(): string {
        return this.props.shopId
    }

    get code(): string {
        return this.props.code
    }

    get snapshot() {
        return {
            id: this.props.id,
            code: this.props.code,
            shopId: this.props.shopId,
            isInWallet: this.props.isInWallet,
            createdAt: this.props.createdAt
        }
    }

    static create(props: CreateProps) {
        return new LoyaltyCard({
            ...props,
            isInWallet: false,
            createdAt: props.currentDate
        })
    }
}
