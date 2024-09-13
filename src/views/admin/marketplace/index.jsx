import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { stackList } from '../../../helperList/StackList';
import { industryList } from '../../../helperList/Industry';
import { departmentsList } from '../../../helperList/Departments';
import Autosuggest from "react-autosuggest";
import axios from 'axios';
import Loading from "../../../dashboard/Loading";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Card from "../../../components/card";
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';

function CreateContest() {
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [selections, setSelections] = useState([]);
    const [stackValue, setStackValue] = useState('');
    const [stackSuggestionsList, setStackSuggestionsList] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    const [draftContest, setDraftContest] = useState("");
    const [files, setFiles] = useState([]);
    const [step, setStep] = useState(1); // Step state to navigate between form pages
    const [formData, setFormData] = useState({});
    const [upvote, setUpvote] = useState(false); // State for upvote
    const navigate = useNavigate();

    const { fields, append, remove } = useFieldArray({ control, name: "locations" });

    useEffect(() => {
        fetchContestData();
    }, []);

    const fetchContestData = async () => {
        setLoading(true);
        const token = secureLocalStorage.getItem("accessTokenCompany");
        try {
            const response = await axios.post(`${import.meta.env.VITE_HOST}/contests/collectData`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            setFormFieldValues(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const setFormFieldValues = (data) => {
        setValue('companyInfo', data.company_info || "");
        setValue('productsServices', data.products_services || "");
        setValue('industry', data.industry || "");
        setValue('department', data.department || "");
        setSelections(data.stack_list || []);
        setValue('name', data.company_name || "");
    };

    const onSubmit = async (data) => {
        const locationsString = data.locations.map(loc => loc.location).join(', ');

        setFormData(prevData => ({
            ...prevData,
            ...data,
            locations: locationsString,
            files,
            upvote // Include upvote state
        }));

        if (step === 1) {
            setLoading(true);
            const token = secureLocalStorage.getItem("accessTokenCompany");
            try {
                const response = await axios.post(`${import.meta.env.VITE_HOST}/contests/createContest`, {
                    ...data,
                    stack_list: selections,
                    files,
                    locations: locationsString,
                    upvote // Include upvote state
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDraftContest(response.data.draftContest || "");
                setLoading(false);
                setStep(2);
            } catch (error) {
                console.error('Error creating contest:', error);
                setLoading(false);
            }
        } else if (step === 2) {
            setStep(3);
        } else {
            submitFinalData({ ...formData, ...data, locations: locationsString });
        }
    };

    const submitFinalData = async (data) => {
        setLoading(true);
        const token = secureLocalStorage.getItem("accessTokenCompany");
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("companyInfo", data.companyInfo);
            formData.append("productsServices", data.productsServices);
            formData.append("industry", data.industry);
            formData.append("department", data.department);
            formData.append("role", data.role);
            formData.append("stack_list", JSON.stringify(selections));
            formData.append("draftContest", draftContest);
            formData.append("contestName", data.contestName);
            formData.append("locations", data.locations);
            formData.append("deadline", data.deadline);
            formData.append("awards", data.awards);
            formData.append("upvote", upvote); // Include upvote state
            files.forEach(file => {
                formData.append("files", new Blob([Uint8Array.from(atob(file.file), c => c.charCodeAt(0))]), file.filename);
            });

            const response = await axios.post(`${import.meta.env.VITE_HOST}/contests/writeContest`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDraftContest(response.data.draftContest || "");
            setIsDraft(true);
            setLoading(false);
            navigate('/admin/my-contests');
        } catch (error) {
            console.error('Error creating contest:', error);
            setLoading(false);
        }
    };

    const getStackSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : stackList.filter(
            suggestion => suggestion.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    const handleStackTagClick = (suggestion) => {
        setSelections((prevSelections) => [...prevSelections, suggestion]);
        setStackValue('');
    };

    const handleStackTagRemove = (index) => {
        setSelections((prevSelections) => prevSelections.filter((_, i) => i !== index));
    };

    const onStackSuggestionsFetchRequested = ({ value }) => {
        setStackSuggestionsList(getStackSuggestions(value));
    };

    const onStackSuggestionsClearRequested = () => {
        setStackSuggestionsList([]);
    };

    const onStackChange = (event, { newValue }) => {
        setStackValue(newValue);
    };

    const onDrop = (acceptedFiles) => {
        const readFiles = acceptedFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const binaryStr = reader.result;
                    resolve({ filename: file.name, file: btoa(binaryStr) }); // Convert binary string to Base64
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.readAsBinaryString(file); // Read file as binary string
            });
        });

        Promise.all(readFiles)
            .then((filesWithContent) => {
                setFiles((prevFiles) => [...prevFiles, ...filesWithContent]);
            })
            .catch((error) => {
                console.error("Error reading file content:", error);
            });
    };

    const handleDeleteFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const stackInputProps = {
        placeholder: "Type a technology",
        value: stackValue,
        onChange: onStackChange,
        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
    };

    const renderSuggestion = (suggestion, { query, isHighlighted }) => (
        <div className={`p-2 m-1 ${isHighlighted ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-navy-900'} border rounded cursor-pointer`}>
            {suggestion}
        </div>
    );

    const theme = {
        container: 'relative',
        input: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white',
        suggestionsContainer: 'absolute z-10 w-full bg-white dark:bg-navy-800 border border-gray-300 rounded mt-1',
        suggestionsList: 'flex flex-wrap',
        suggestion: 'p-2 m-1 bg-white dark:bg-navy-900 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer',
        suggestionHighlighted: 'bg-gray-200 dark:bg-gray-700'
    };

    const readFileAsBinary = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    };

    const getFileTypeIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />;
            case 'xlsx':
            case 'xls':
                return <FontAwesomeIcon icon={faFileExcel} className="text-green-500" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <FontAwesomeIcon icon={faFileImage} className="text-blue-500" />;
            default:
                return <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />;
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return (
        <div className="flex h-full w-full">
            <div className="h-full w-full bg-lightPrimary dark:bg-navy-900">
                <main className="mx-[12px] h-full flex-none transition-all md:pr-2">
                    <div className="h-full">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-5 m-auto my-6">
                            {loading && <div className='fixed inset-0 z-50'><Loading /></div>}
                            <Card extra="w-full h-full px-6 pb-6 sm:overflow-x-auto">
                                {step === 1 && (
                                    <>
                                        <h4 className="mt-3 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4 font-bold text-black/70 dark:text-white">
                                            Step 1: Company Details
                                        </h4>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="name">Company Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                placeholder="Company Name"
                                                {...register("name", { required: "Company Name is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="industry">Industry</label>
                                            <select
                                                name="industry"
                                                id="industry"
                                                {...register("industry", { required: "Industry is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            >
                                                <option value="">Select an industry</option>
                                                {industryList.map((industry, index) => (
                                                    <option key={index} value={industry}>{industry}</option>
                                                ))}
                                            </select>
                                            {errors.industry && <p className="text-red-500 text-xs italic">{errors.industry.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="companyInfo">Company About</label>
                                            <textarea
                                                name="companyInfo"
                                                id="companyInfo"
                                                {...register("companyInfo", { required: "Company About is required" })}
                                                className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            ></textarea>
                                            {errors.companyInfo && <p className="text-red-500 text-xs italic">{errors.companyInfo.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="productsServices">Products and Services</label>
                                            <textarea
                                                name="productsServices"
                                                id="productsServices"
                                                {...register("productsServices", { required: "Products and Services are required" })}
                                                className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            ></textarea>
                                            {errors.productsServices && <p className="text-red-500 text-xs italic">{errors.productsServices.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="stackList">Technologies</label>
                                            <div className="flex flex-wrap items-center border rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white">
                                                {selections.map((selection, index) => (
                                                    <div key={index} className="flex items-center bg-blue-200 text-blue-800 p-1 m-1 rounded dark:bg-blue-800 dark:text-white">
                                                        {selection}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStackTagRemove(index)}
                                                            className="ml-2 text-red-600 dark:text-red-400"
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                                <Autosuggest
                                                    suggestions={stackSuggestionsList}
                                                    onSuggestionsFetchRequested={onStackSuggestionsFetchRequested}
                                                    onSuggestionsClearRequested={onStackSuggestionsClearRequested}
                                                    getSuggestionValue={(suggestion) => suggestion}
                                                    renderSuggestion={renderSuggestion}
                                                    inputProps={stackInputProps}
                                                    theme={theme}
                                                    onSuggestionSelected={(event, { suggestion }) => handleStackTagClick(suggestion)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="department">Department</label>
                                            <select
                                                name="department"
                                                id="department"
                                                {...register("department", { required: "Department is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            >
                                                <option value="">Select a department</option>
                                                {departmentsList.map((dept, index) => (
                                                    <option key={index} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                            {errors.department && <p className="text-red-500 text-xs italic">{errors.department.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="name">Role Hiring</label>
                                            <input
                                                type="text"
                                                name="role"
                                                id="role"
                                                placeholder="Role Hiring..."
                                                {...register("role", { required: "Role is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            />
                                            {errors.role && <p className="text-red-500 text-xs italic">{errors.role.message}</p>}
                                        </div>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <h4 className="mt-3 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4 font-bold text-black/70 dark:text-white">
                                            Step 2: Draft Contest
                                        </h4>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="draftContest">Draft Contest</label>
                                            <textarea
                                                name="draftContest"
                                                id="draftContest"
                                                value={draftContest}
                                                onChange={(e) => setDraftContest(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                                rows="10"
                                            />
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white mt-4" htmlFor="fileUpload">Upload Files</label>
                                            <div {...getRootProps()} className={`border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer transition bg-white dark:bg-navy-800 ${isDragActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                                <input {...getInputProps()} />
                                                <div className="text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm3 2a2 2 0 10-4 0v12a2 2 002 2h10a2 2 002-2V7h-2v8H6V5zM7 9h6v2H7V9z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="mt-2 text-gray-600 dark:text-gray-400">Drag 'n' drop some files here, or click to select files</p>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Total file size limit is 50Mb</p>
                                                </div>
                                            </div>
                                            {files.length > 0 && (
                                                <ul className="mt-2 flex flex-wrap gap-4">
                                                    {files.map((file, index) => (
                                                        <li key={index} className="flex items-center p-2 border rounded bg-white shadow-md hover:bg-gray-100 cursor-pointer">
                                                            {getFileTypeIcon(file.filename)}
                                                            <span className="ml-2 text-gray-700">{file.filename}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteFile(index)}
                                                                className="ml-2 text-red-600 dark:text-red-400"
                                                            >
                                                                Delete
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <h4 className="mt-3 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4 font-bold text-black/70 dark:text-white">
                                            Step 3: Contest Details
                                        </h4>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="contestName">Contest Name</label>
                                            <input
                                                type="text"
                                                name="contestName"
                                                id="contestName"
                                                placeholder="Contest Name"
                                                {...register("contestName", { required: "Contest Name is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            />
                                            {errors.contestName && <p className="text-red-500 text-xs italic">{errors.contestName.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="locations">Locations</label>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center mb-2">
                                                    <input
                                                        type="text"
                                                        name={`locations[${index}]`}
                                                        placeholder="Location"
                                                        {...register(`locations.${index}.location`, { required: "Location is required" })}
                                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="ml-2 text-red-600 dark:text-red-400"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => append({ location: "" })}
                                                className="bg-gray-700 hover:bg-gray-600 dark:bg-navy-700 dark:hover:bg-navy-600 py-2 px-4 text-white rounded-lg"
                                            >
                                                Add Location
                                            </button>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="deadline">Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                id="deadline"
                                                {...register("deadline", { required: "Deadline is required" })}
                                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            />
                                            {errors.deadline && <p className="text-red-500 text-xs italic">{errors.deadline.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="awards">Awards</label>
                                            <textarea
                                                name="awards"
                                                id="awards"
                                                placeholder="Awards"
                                                {...register("awards", { required: "Awards are required" })}
                                                className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-navy-900 dark:text-white"
                                            ></textarea>
                                            {errors.awards && <p className="text-red-500 text-xs italic">{errors.awards.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="upvote">Upvote</label>
                                            <input
                                                type="checkbox"
                                                name="upvote"
                                                id="upvote"
                                                checked={upvote}
                                                onChange={() => setUpvote(!upvote)}
                                                className="mr-2 leading-tight"
                                            />
                                            <span className="text-gray-700 dark:text-white">Select if you want to implement upvote system. This is specifically designed for marketing purposes where the top 10 will be selected by the upvote system by the users.</span>
                                        </div>
                                    </>
                                )}
                            </Card>
                            <div className="flex justify-between mt-8 sm:mt-10">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="bg-gray-700 hover:bg-gray-600 dark:bg-navy-700 dark:hover:bg-navy-600 py-3.5 px-8 text-white rounded-lg"
                                    >
                                        Previous
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="justify-self-center flex items-center justify-center sm:block bg-gray-700 hover:bg-gray-600 dark:bg-navy-700 dark:hover:bg-navy-600 py-3.5 px-32 text-white rounded-lg hover:cursor-pointer"
                                >
                                    {step === 3 ? 'Submit' : 'Next'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CreateContest;
