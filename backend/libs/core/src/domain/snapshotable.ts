export type Snapshotable<
    S extends Record<string, unknown> = Record<string, unknown>,
> = {
    snapshot: S
}
