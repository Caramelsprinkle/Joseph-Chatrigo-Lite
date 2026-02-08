import Image from 'next/image';

const signup = () => {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-900">
        <body class="h-full">
        ```
      */}
      <div className="my-auto z-10 flex justify-center items-center flex-col max-w-7xl mx-auto h-screen sm:px-16">
        <div className="bg-neutral-50 rounded-lg flex min-h-50% flex-col justify-center px-6 py-12 lg:px-20 lg:py-16">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              alt="Your Company"
              src="/LogoChatrigo1.png"
              width={200}
              height={200}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-800">Create account</h2>
            <p className="text-center text-sm/6 text-gray-500">Join Chatrigo and start your journey!</p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm/6 font-semibold text-gray-800">
                  Username
                </label>
                <div className="mt-2 outline-2 outline-offset-2 outline-stone-900/40 rounded-md">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-800">
                  Email address
                </label>
                <div className="mt-2 outline-2 outline-offset-2 outline-stone-900/40 rounded-md">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-semibold text-gray-800">
                    Password
                  </label>
                </div>
                <div className="mt-2 outline-2 outline-offset-2 outline-stone-900/40 rounded-md">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6"
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <label htmlFor="confirmPassword" className="block text-sm/6 font-semibold text-gray-800">
                    Konfirmasi Password
                  </label>
                </div>
                <div className="mt-2 outline-2 outline-offset-2 outline-stone-900/40 rounded-md">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Create Account
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Login here!
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default signup