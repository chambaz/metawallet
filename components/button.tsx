import clsx from 'clsx'

type Props = {
  children: JSX.Element | string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'pill'
  type?: 'button' | 'submit'
  className?: string
  onClick?: Function
}

export const Button = ({
  children,
  size = 'sm',
  variant = 'button',
  type = 'button',
  className = '',
  onClick = () => {},
}: Props) => {
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={clsx(
        'flex items-center justify-center ml-auto text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        size === 'sm' && 'px-8 py-2 text-sm',
        size === 'md' && 'px-6 py-4 text-sm',
        size === 'lg' && 'px-12 py-4',
        variant === 'button' &&
          'text-white font-bold bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700',
        variant === 'pill' &&
          'border border-gray-800 rounded-full dark:border-white hover:bg-white hover:text-gray-800',
        className
      )}>
      {children}
    </button>
  )
}
