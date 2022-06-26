import clsx from 'clsx'
import { Oval } from 'react-loader-spinner'

type Props = {
  label?: string
  className?: string
  color?: string
}

export const Loader = ({
  label = 'Loading',
  className = '',
  color = 'blue',
}: Props) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-4 font-medium text-center',
        className
      )}>
      {label}...
      <Oval
        ariaLabel="loading-indicator"
        height={60}
        width={60}
        strokeWidth={5}
        strokeWidthSecondary={2}
        color={color}
        secondaryColor="transparent"
      />
    </div>
  )
}
