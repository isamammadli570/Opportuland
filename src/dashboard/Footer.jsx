import React from "react";
import { Link } from "react-router-dom";
import { theme } from "../theme/theme";

export default function Footer() {
  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
          <div className="h-full">
            <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
              <h5 className="mb-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:!mb-0 md:text-lg">
                <p className="mb-4 text-center text-sm text-zinc-600 dark:text-zinc-300 sm:!mb-0 md:text-base">
                  ©{1900 + new Date().getYear()} OpportuLand. All Rights Reserved.
                </p>
              </h5>
              <div>
                <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="mailto:remoteap@remote-auto.com"
                      className="text-base font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-600"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/company/remote-auto/"
                      className="text-base font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.792-1.75-1.767s.784-1.767 1.75-1.767 1.75.792 1.75 1.767-.784 1.767-1.75 1.767zm13.5 12.268h-3v-5.5c0-1.379-1.121-2.5-2.5-2.5s-2.5 1.121-2.5 2.5v5.5h-3v-11h3v1.643c.825-.89 2.021-1.643 3.5-1.643 2.481 0 4.5 2.019 4.5 4.5v6.5z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://wa.me/994513315387"
                      className="text-base font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.014.489 3.928 1.342 5.632L0 24l6.368-1.331A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.968 0-3.814-.568-5.393-1.553l-.39-.237-4.041.847 1.118-4.187-.257-.399A10.002 10.002 0 1122 12c0 5.522-4.478 10-10 10z" />
                        <path d="M17.513 14.568l-.947-.46a.497.497 0 00-.484.04l-.728.452a.498.498 0 01-.555-.043 10.556 10.556 0 01-3.495-3.495.498.498 0 01-.043-.555l.451-.728a.499.499 0 00.04-.484l-.46-.947a.501.501 0 00-.653-.255c-.986.451-2.28 1.58-2.426 1.726-.145.145-.686.686-.727.73a.494.494 0 00-.073.626c.187.358 1.128 2.109 2.716 3.697 1.588 1.588 3.339 2.528 3.697 2.716a.494.494 0 00.626-.073c.044-.041.584-.582.73-.727.145-.146 1.275-1.44 1.726-2.426a.5.5 0 00-.255-.654z" />
                      </svg>
                    </a>
                  </li>
                  {/* <li>
                    <a
                      target="blank"
                      href="mailto:rb@remote-auto.com"
                      className="text-base font-medium text-zinc-600 hover:text-zinc-600"
                    >
                      Support
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
