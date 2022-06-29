import clsx from 'clsx'

type Props = {
  children: JSX.Element | string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'pill'
  theme?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  className?: string
  onClick?: Function
}

export const Button = ({
  children,
  size = 'sm',
  variant = 'button',
  theme = 'primary',
  type = 'button',
  className = '',
  onClick = () => {},
}: Props) => {
  return (
    <button
      type={type}
      onClick={(e) => onClick(e)}
      className={clsx(
        'flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        size === 'sm' && 'px-8 py-2 text-sm',
        size === 'md' && 'px-6 py-4 text-sm',
        size === 'lg' && 'px-12 py-4',
        variant === 'button' && ' font-bold  border  rounded-md shadow-sm',
        variant === 'button' &&
          theme === 'primary' &&
          'text-white bg-indigo-600 border-transparent hover:bg-indigo-700',
        variant === 'button' &&
          theme === 'secondary' &&
          'text-gray-700 bg-white border-gray-300 hover:bg-gray-50',
        variant === 'pill' &&
          'border border-gray-800 rounded-full dark:border-white hover:bg-white hover:text-gray-800',
        className
      )}>
      {children}
    </button>
  )
}
