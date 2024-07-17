'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import logo from '../public/logo.png'
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { useLoginMutation } from './_lib/redux/features/auth/auth_api';
import { redirect, useRouter } from 'next/navigation';

export default function Home() {
  const [login, { data, isSuccess, error }] = useLoginMutation();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.push("/dashboard");
      console.log(data);
    } else if (error && error.message) {
      console.log("Login failed:", error.message);
      redirect('/');
    }
  }, [isSuccess, error, router]);

  //states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Submit From
  const submitForm = async e => {
    e.preventDefault();

    try {
      await login({
        email: email,
        password: password,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  const [lightMode, setLightMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    if (theme === "light") setLightMode(true)
  }, [])

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem("theme", "dark")
    }
  }, [lightMode])

  return (
    <div className="min-h-screen h-screen bg-white dark:bg-[#1e1e1e]">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-end p-6 lg:px-8" aria-label="Global">
          <div className='relative w-[53px] h-[30px] flex items-center bg-slate-300 dark:bg-[#121212] bg-teal-500bg-teal-500 cursor-pointer rounded-full p-1 mr-10' onClick={() => setLightMode(!lightMode)}>
            <BsSunFill className="text-yellow-400" size={18} />
            <div className='absolute bg-white dark:bg-[#3c4042] w-6 h-6 rounded-full shadow-md transform transition-transform duration-300' style={lightMode ? { left: "2px" } : { right: "2px" }}>
            </div>
            <FaMoon className="ml-auto text-yellow-400" size={18} />
          </div>
        </nav>
      </header>

      <div className="relative px-6 isolate pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <div>
            <div className="flex flex-col justify-center flex-1 min-h-full px-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                  className="mx-auto"
                  src={logo}
                  alt="logo"
                />
                <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900 dark:text-white">
                  Sign in to your account
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="max-w-sm mx-auto" onSubmit={submitForm}>
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email Address
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-[#606368] dark:text-gray-400 dark:border-gray-600">
                        <MdAlternateEmail className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="jhon@gmail.com"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      password
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-[#606368] dark:text-gray-400 dark:border-gray-600">
                        <RiLockPasswordLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </span>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-[#3c4042] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Bonnie Green"
                      />
                    </div>
                  </div>
                  <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                      <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                    </div>
                    <label for="remember" className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300">Remember me</label>
                  </div>
                  <button type="submit" className="w-full text-white bg-[#213389] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#213389] dark:focus:ring-blue-800">Sign in</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] loginart"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}