export const Community = () => {
  return (
    <div className="relative py-16">
      <div className=" bg-violet-700">
        <div className="max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join the community.</span>
            <span className="block">Help shape the future.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
            Malesuada adipiscing sagittis vel nulla nec.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md cursor-help hover:bg-indigo-50 sm:w-auto">
            Join our Discord
          </a>
          <span className="block my-4 italic text-slate-50">(coming soon)</span>
        </div>
      </div>
    </div>
  )
}
