import { theme } from "../theme/theme";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function Contest() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className="bg-white  rounded-sm border mb-4 border-gray-200 p-4 w-full my-5 min-h-screen">
              <div className="mt-3 w-full">
                <div className="w-full grid gap-4 ">
                  <div className="bg-[#bbc1c98a] py-3 px-2.5 text-sm ">
                    <div className="grid grid-cols-8">
                      <h3
                        className="col-span-2 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Name
                      </h3>
                      <h3
                        className="col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Company
                      </h3>

                      <h3
                        className=" col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Award
                      </h3>
                      <h3
                        className=" col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Country
                      </h3>
                      <h3
                        className="col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Submissions
                      </h3>
                      <h3
                        className="col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        Deadline
                      </h3>

                      <h3
                        className=" col-span-1 font-bold "
                        style={{ color: theme.dark }}
                      >
                        See More
                      </h3>
                    </div>
                  </div>
                  <div>
                    <div className=" py-3 px-2.5 text-sm grid grid-cols-8  items-center  hover:bg-slate-300/50 duration-300">
                      <h3 className="cursor-pointer col-span-2 text-black/70 font-medium">
                        Ofis Dizaynı müsabiqəsi
                      </h3>
                      <h3 className="col-span-1 text-black/70 font-medium">
                        SABAH.HUB & Push30
                      </h3>

                      <h3 className="col-span-1 text-black/70 font-medium">
                        1000 AZN cash prize
                        <br />
                        One-month free subscription to Push30
                        <br />
                        Ticket to the Baku ID 2024 event
                        <br />
                        Certificate from SABAH.HUB and Push30.
                      </h3>
                      <h3 className="col-span-1 text-black/70 font-medium">
                        Azərbaycan
                      </h3>
                      <h3
                        className="col-span-1 text-black/70 font-medium whitespace-pre-line "
                        onMouseEnter={() => setShowMessage(true)}
                        onMouseLeave={() => setShowMessage(false)}
                      >
                        0
                        <span
                          className="info-icon"
                          role="img"
                          aria-label="information"
                          style={{ marginLeft: "5px" }}
                        >
                          ℹ️
                        </span>{" "}
                        {showMessage && (
                          <span className="tooltip text-stone-400 font-light ">Will be updated daily</span>
                        )}
                      </h3>

                      <h3 className="col-span-1 text-red-500 font-medium">
                        May 2, 11:59 p.m
                      </h3>

                      <h3 className="col-span-1">
                        <Link
                          to='/contest/1'
                          target="_blank"
                        >
                          <button
                            className=" text-white w-36 px-3 py-2 rounded-sm"
                            style={{ background: theme.yellow }}
                          >
                            View
                          </button>
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
