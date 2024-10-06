
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faFaceLaughBeam,
  faMinus,
  faPalette,
  faSquareCaretDown,
  faTrophy,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

export default function ContestItem() {

  const handleApplyClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdrYdx5H-lGXEVatkruOSoVGqZE03aK4DX4FPM06l6zVEdVuw/viewform", "_blank");
  };

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className="w-[90%] m-auto min-h-[100vh] py-5 px-3 text-black">

              <div className="w-full h-auto mb-4">
                <h2 className="font-semibold text-2xl my-4">
                  Kreativ rəssam və dizaynerlərə səslənirik!{" "}
                  <FontAwesomeIcon
                    icon={faWandMagicSparkles}
                    className="mx-2 text-yellow-400"
                  />{" "}
                  <FontAwesomeIcon icon={faPalette} className="text-amber-700" />
                </h2>
                <h2 className=" text-lg my-4">
                  Yeni ofisimizin dizaynında sizin də toxunuşunuz olsun!
                  <a
                    href="https://www.linkedin.com/company/sabahhub1/"
                    className="text-blue-500 underline mx-2"
                  >
                    SABAH.HUB
                  </a>{" "}
                  və{" "}
                  <a
                    href="https://www.linkedin.com/company/push30/"
                    className="text-blue-500 underline mx-2"

                  >
                    Push30{" "}
                  </a>{" "}
                  yerli rəssam və dizaynerlər üçün Ofis Dizaynı müsabiqəsi elan edir
                  <FontAwesomeIcon
                    icon={faFaceLaughBeam}
                    className="text-yellow-500 mx-2"
                  />
                </h2>

                <h2 className=" text-lg my-4">
                  {" "}
                  Yaradıcılığını nümayiş etdirmək istəyən, müxtəlif mükafatlar əldə
                  etmək istəyənləri dəvət edirik.
                </h2>

                <ul className="text-base my-3 whitespace-pre-line">
                  <h3 className="text-lg font-semibold">
                    Müsabiqə şərtləri{" "}
                    <FontAwesomeIcon
                      icon={faSquareCaretDown}
                      className="text-blue-500 text-xl"
                    />
                  </h3>
                  <li>
                    <FontAwesomeIcon icon={faMinus} /> Əl işinizi və portfolionuzu
                    bizə göndərirsiniz;
                  </li>
                  <li className="my-3">
                    <FontAwesomeIcon icon={faMinus} /> Seçilmiş rəssam və dizaynerlər
                    layihənin detalları ilə bağlı ətraflı tanış olmaq üçün 4 may
                    tarixində ofisimizə dəvət olunacaq;
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} /> Əl işləriniz
                    dəyərləndirildikdən sonra qaliblər təyin olunacaq.
                  </li>
                </ul>
                <ul className="text-base my-8 whitespace-pre-line ">
                  <h3 className="text-lg font-semibold my-2">
                    {" "}
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="text-amber-600 text-xl "
                    />{" "}
                    Mükafatlar{" "}
                    <FontAwesomeIcon
                      icon={faSquareCaretDown}
                      className="text-blue-500 text-xl"
                    />
                  </h3>
                  <li>
                    {" "}
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />{" "}
                    1000 AZN dəyərində pul mükafatı;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />
                    <a
                      href="https://www.linkedin.com/company/push30/"
                      className="text-blue-500 underline"
                    >
                      Push30
                    </a>{" "}
                    -dan 1 aylıq pulsuz abunə haqqı;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />{" "}
                    <a
                      href="https://www.linkedin.com/company/baku-id/"
                      className="text-blue-500 underline"
                    >
                      Baku ID{" "}
                    </a>{" "}
                    2024 tədbirinə hədiyyə bilet;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />{" "}
                    <a
                      href="https://www.linkedin.com/company/sabahhub1/"
                      className="text-blue-500 underline"
                    >
                      {" "}
                      SABAH.HUB{" "}
                    </a>{" "}
                    və <a href="">Push30</a> tərəfindən sertifikat.
                  </li>
                </ul>
                <h3 className="text-base my-3 whitespace-pre-line">
                  4 ədəd qalib iş may ayında baş tutacaq Startup Cafe-də elan
                  olunacaq!
                </h3>
                <h3 className="text-base my-3 whitespace-pre-line">
                  Müsabiqəyə qatılmaq üçün son tarix:{" "}
                  <span className="font-semibold">2 may, 23:59.</span>
                </h3>
                <h3>Hər kəsə uğurlar! </h3>
              </div>

              <div className="w-full h-auto mb-4">
                <h2 className="font-semibold text-2xl my-4">
                  Calling all creative minds—artists and designers!{" "}
                  <FontAwesomeIcon
                    icon={faWandMagicSparkles}
                    className="mx-2 text-yellow-400"
                  />{" "}
                  <FontAwesomeIcon icon={faPalette} className="text-amber-700" />
                </h2>
                <h2 className=" text-lg my-4">
                  Unleash your creativity in designing our new office!
                  <a
                    href="https://www.linkedin.com/company/sabahhub1/"
                    className="text-blue-500 underline mx-2"
                  >
                    SABAH.HUB
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.linkedin.com/company/push30/"
                    className="text-blue-500 underline mx-2"
                  >
                    Push30{" "}
                  </a>{" "}
                  are thrilled to announce an Office Design Contest for local talents
                  <FontAwesomeIcon
                    icon={faFaceLaughBeam}
                    className="text-yellow-500 mx-2"
                  />
                </h2>

                <h2 className=" text-lg my-4">
                  {" "}
                  We’re inviting you to showcase your creative prowess and win
                  exciting prizes.
                </h2>

                <ul className="text-base my-3 whitespace-pre-line">
                  <h3 className="text-lg font-semibold">
                    Contest Details{" "}
                    <FontAwesomeIcon
                      icon={faSquareCaretDown}
                      className="text-blue-500 text-xl"
                    />
                  </h3>
                  <li>
                    <FontAwesomeIcon icon={faMinus} /> Submit your creative work and
                    portfolio;
                  </li>
                  <li className="my-3">
                    <FontAwesomeIcon icon={faMinus} /> Selected participants will be
                    invited to our office on May 4 for further insights into the
                    project;
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMinus} /> Winners will be chosen based on
                    the evaluation of their Submissions.
                  </li>
                </ul>
                <ul className="text-base my-8 whitespace-pre-line ">
                  <h3 className="text-lg font-semibold my-2">
                    {" "}
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="text-amber-600 text-xl "
                    />{" "}
                    Prizes Include{" "}
                    <FontAwesomeIcon
                      icon={faSquareCaretDown}
                      className="text-blue-500 text-xl"
                    />
                  </h3>
                  <li>
                    {" "}
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />
                    1000 AZN cash prize;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />
                    One-month free subscription to
                    <a
                      href="https://www.linkedin.com/company/push30/"
                      className="text-blue-500 underline mx-1"
                    >
                      Push30
                    </a>{" "}
                    ;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />{" "}
                    Ticket to the{" "}
                    <a
                      href="https://www.linkedin.com/company/baku-id/"
                      className="text-blue-500 underline"
                    >
                      Baku ID{" "}
                    </a>{" "}
                    2024 event;
                  </li>
                  <li className="my-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="mx-2 text-yellow-500 text-xl"
                    />{" "}
                    Certificate from{" "}
                    <a
                      href="https://www.linkedin.com/company/sabahhub1/"
                      className="text-blue-500 underline"
                    >
                      {" "}
                      SABAH.HUB{" "}
                    </a>{" "}
                    and <a href="">Push30</a>;
                  </li>
                </ul>
                <h3 className="text-base my-3 whitespace-pre-line">
                  We will announce four winners at the Startup Cafe in May!
                </h3>
                <h3 className="text-base my-3 whitespace-pre-line">
                  Apply by
                  <span className="font-semibold"> 2 may, 23:59.</span>
                </h3>
                <h3>Wishing everyone the best of luck! </h3>
              </div>


              <div className="flex justify-center flex-col">
                <button
                  onClick={() => handleApplyClick()}
                  className=" text-white w-36 px-3 py-2 rounded-sm bg-yellow-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
