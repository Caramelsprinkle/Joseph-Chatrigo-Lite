'use client'

import Image from 'next/image'
import { useActionState } from 'react'

import { signupAction, type AuthActionState } from '@/app/(auth)/actions'

const SignupForm = () => {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signupAction,
    {},
  )

  return (
    <div className="h-screen w-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-neutral-50 rounded-2xl shadow-lg border border-slate-200 px-6 py-10">
        <div className="flex flex-col items-center">
          <Image
            className="h-10 w-auto"
            src="/LogoChatrigo1.png"
            alt="Chatrigo"
            width={200}
            height={50}
            priority
          />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
        </div>

        <div className="mt-8">
          <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {state?.error ? (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {state.error}
            </div>
          ) : null}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-60"
            >
              {pending ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
