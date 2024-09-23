
export default function Landing() {

  return (
    <div>
      <div className="mx-auto max-w-2xl sm:py-40 lg:py-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-300 sm:text-5xl">
            Eat Sleep Type Repeat
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-300">
          A minimalistic and customizable multiplayer typing test
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/room"
              className="rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
