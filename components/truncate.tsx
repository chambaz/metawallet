type Props = {
  address: string
  digits?: number
}

export const Truncate = ({ address, digits = 4 }: Props) => {
  return (
    <>
      {address.substring(0, digits)}...
      {address.substring(address.length - digits)}
    </>
  )
}
