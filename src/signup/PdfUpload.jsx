import { useState } from "react";
import logo from "../../src/assets/icons/pdf.svg";
import Loading from "../dashboard/Loading";

export default function PdfUpload({
  setStep,
  data,
  setData,
  resumeName,
  setResumeName,
  ResumeConvertText,
}) {
  const [loading, setLoading] = useState(false);

  const pickAndConvert = async (event) => {
    try {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        if (selectedFile.type === "application/pdf") {
          setData(selectedFile);
          setResumeName(selectedFile.name);
        } else {
          console.log("Selected file is not a PDF. Please choose a PDF file.");
        }
      } else {
        alert("Please select a file");
      }
    } catch (error) {
      console.error("Error while selecting or converting file:", error);
    }
  };

  const handleNextStep = async () => {
    if (data && resumeName) {
      try {
        setLoading(true);
        const result = await ResumeConvertText(data, resumeName);
        setLoading(false);

        if (result) {
          setStep(2);
        } else {
          console.log("Error uploading or converting resume");
        }
      } catch (error) {
        console.error("Error uploading or converting resume:", error);
      }
    } else {
      alert("Select a file");
    }
  };

  return (
    // <div className="flex h-full w-full">
    // <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
    //   <main
    //     className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
    //   >
    //     <div className="h-full">
    <div className="w-full min-h-screen flex items-center justify-center">
    <div id="card" className="w-full h-full flex-grow relative flex justify-center items-center overflow-hidden">
        <div id="pdf" className="w-full h-full flex flex-col items-center">
            {loading ? <div className='fixed inset-0 z-50'><Loading /></div> : null}
            <button className="absolute right-4 top-4"></button>
            <h3 className='text-center sm:text-start w-fit text-3xl lg:text-[40px] bg-[#a37bfd]font-medium pb-2 md:px-12 mb-4 font-bold text-black/70'>
            Upload Your Resume
            </h3>
            <div className="h-[300px] w-[300px] border-2 border-dashed border-yellow-500 rounded-xl mt-8 flex flex-col items-center justify-center">
                <div className="w-full absolute flex flex-col items-center pointer-events-none">
                    <img className="w-32 h-32 pb-12" src={logo} alt="pdfLogo.svg" />
                    <div className="w-72 flex-wrap mb-12">
                        <p className="text-yellow-500 text-xs text-center font-light mb-1">
                            - For better performance upload CV in English
                        </p>
                        <p className="text-yellow-500 text-xs text-center font-light">
                            - Please do not upload picture pdfs (if you can select the text in your resume it is good)
                        </p>
                    </div>
                </div>
                <input
                    onChange={pickAndConvert}
                    className="hover:cursor-pointer w-full h-full pt-60 pl-4 file:mr-12 file:py-2 file:px-4 
                    file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50
                    file:text-yellow-500 hover:file:bg-yellow-100 hover:file:cursor-pointer mb-5"
                    type="file"
                    accept=".pdf"
                    id="file"
                    name="file"
                />
            </div>
            <button
                onClick={handleNextStep}
                id="btn"
                className="mb-5 bg-yellow-500 hover:bg-yellow-600 transition-all max-w-[400px] w-full md:w-fit flex items-center justify-center sm:block py-3.5 sm:px-32 text-white rounded-full mt-8 hover:cursor-pointer"
            >
                {loading ? "Loading..." : "Next Step"}
            </button>
        </div>
    </div>
</div>
  // </div></main></div></div>
  );
}
