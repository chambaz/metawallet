export const Heading = ({ children }: { children: JSX.Element | string }) => {
  return (
    <h1 className="text-5xl font-extrabold text-transparent break-words md:px-20 md:text-7xl bg-clip-text bg-gradient-to-r from-teal-300 to-violet-700 dark:to-violet-600">
      {children}
    </h1>
  )
}
