import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Autosuggest from "react-autosuggest";
import { stackList } from '../helperList/StackList';
import { industryList } from '../helperList/Industry';
import { departmentsList } from '../helperList/Departments';
import Loading from "../dashboard/Loading";
import Card from "../components/card";

// Function to filter suggestions for stackList
const getStackSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : stackList.filter(
        suggestion => suggestion.toLowerCase().slice(0, inputLength) === inputValue
    );
};

// Function to render each suggestion
const renderSuggestion = (suggestion, { query, isHighlighted }) => (
    <div className={`p-2 m-1 ${isHighlighted ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-zinc-900'} border rounded cursor-pointer`}>
        {suggestion}
    </div>
);

function MyForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isDataFromLocalStorage, setIsDataFromLocalStorage] = useState(false);
    const [stackValue, setStackValue] = useState('');
    const [stackSuggestionsList, setStackSuggestionsList] = useState([]);
    const [selections, setSelections] = useState([]);

    useEffect(() => {
        loadFormDataFromLocalStorage();
    }, []);

    const loadFormDataFromLocalStorage = () => {
        const companyData = localStorage.getItem("companyData");
        if (companyData) {
            const parsedCompanyData = JSON.parse(companyData);
            setFormFieldValues(parsedCompanyData);
            setIsDataFromLocalStorage(true);
        } else {
            const webData = localStorage.getItem("webData");
            if (webData) {
                const parsedWebData = JSON.parse(webData);
                if (parsedWebData?.text) {
                    const parsedText = JSON.parse(parsedWebData.text);
                    setFormFieldValues(parsedText);
                } else if (parsedWebData?.company_info) {
                    setFormFieldValues(parsedWebData);
                    setIsDataFromLocalStorage(true);
                }
            }
        }
    };

    const setFormFieldValues = (data) => {
        setValue('companyInfo', data.company_info || "");
        setValue('productsServices', data.products_services || "");
        setValue('industry', data.industry || "");
        setValue('name', data.name || data.company_name || "");
        setSelections(data.selections || []);
    };

    const setSecureItemAsync = (key, value) => {
        return new Promise((resolve) => {
            secureLocalStorage.setItem(key, value);
            resolve();
        });
    };

    const handleSignup = async (newUserCompany, accessToken) => {
        localStorage.setItem("userCompany", JSON.stringify(newUserCompany));
        await setSecureItemAsync("accessTokenCompany", accessToken);

        localStorage.removeItem("companyData");
        localStorage.removeItem("webData");
        localStorage.removeItem("webDataLinks");
        localStorage.removeItem("formData");
        localStorage.removeItem("otpAndEmail");
        setLoading(false);
        navigate("/admin/default");
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const webData = localStorage.getItem("webData");
        const parsedWebData = webData ? JSON.parse(webData) : {};
        const webDataLinks = localStorage.getItem("webDataLinks");
        const parsedWebDataLinks = webDataLinks ? JSON.parse(webDataLinks) : {};
        const otpAndEmail = localStorage.getItem("otpAndEmail");
        const parsedOtpAndEmail = otpAndEmail ? JSON.parse(otpAndEmail) : {};

        const dataToSend = {
            ...data,
            selections,
            ...parsedWebData
        };

        try {
            const formData = localStorage.getItem("formData");
            const parsedFormData = formData ? JSON.parse(formData) : {};
            const response = await axios.post(`${import.meta.env.VITE_HOST}/auth/createCompany`, { dataToSend, parsedWebDataLinks, parsedFormData, parsedOtpAndEmail });
            if (!response.error) {
                const { company, user, accessToken } = response.data;
                const newUserCompany = {
                    username: user?.name,
                    email: user?.email,
                    admin: user?.admin,
                };
                await handleSignup(newUserCompany, accessToken);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue(name, value);
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

    const stackInputProps = {
        placeholder: "Type a technology",
        value: stackValue,
        onChange: onStackChange,
        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white"
    };

    const theme = {
        container: 'relative',
        input: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white',
        suggestionsContainer: 'absolute z-10 w-full bg-white dark:bg-zinc-800 border border-gray-300 rounded mt-1',
        suggestionsList: 'flex flex-wrap',
        suggestion: 'p-2 m-1 bg-white dark:bg-zinc-900 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer',
        suggestionHighlighted: 'bg-gray-200 dark:bg-gray-700'
    };

    return (
        <div className="flex h-full w-full">
            <div className="h-full w-full bg-lightPrimary dark:bg-zinc-900 duration-200">
                <main className="mx-[12px] h-full flex-none transition-all md:pr-2">
                    <div className="h-full">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-5 w-[70%] m-auto my-6">
                            {loading && <div className='fixed inset-0 z-50'><Loading /></div>}
                            <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
                                <h4 className="mt-3 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4 font-bold text-black/70 dark:text-white">
                                    Company Information
                                </h4>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="name">Company Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Company Name"
                                        {...register("name", { required: "Company Name is required" })}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white ${isDataFromLocalStorage ? 'bg-gray-100 dark:bg-zinc-800 cursor-not-allowed' : ''}`}
                                        disabled={isDataFromLocalStorage}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white">Industry</label>
                                    <select
                                        name="industry"
                                        {...register("industry", { required: "Industry is required" })}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white ${isDataFromLocalStorage ? 'bg-gray-100 dark:bg-zinc-800 cursor-not-allowed' : ''}`}
                                        disabled={isDataFromLocalStorage}
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
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white ${isDataFromLocalStorage ? 'bg-gray-100 dark:bg-zinc-800 cursor-not-allowed' : ''}`}
                                        disabled={isDataFromLocalStorage}
                                    ></textarea>
                                    {errors.companyInfo && <p className="text-red-500 text-xs italic">{errors.companyInfo.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="productsServices">Products and Services</label>
                                    <textarea
                                        name="productsServices"
                                        id="productsServices"
                                        {...register("productsServices", { required: "Products and Services are required" })}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white ${isDataFromLocalStorage ? 'bg-gray-100 dark:bg-zinc-800 cursor-not-allowed' : ''}`}
                                        disabled={isDataFromLocalStorage}
                                    ></textarea>
                                    {errors.productsServices && <p className="text-red-500 text-xs italic">{errors.productsServices.message}</p>}
                                </div>
                            </Card>
                            <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5"}>
                                <h4 className="mt-3 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4 font-bold text-black/70 dark:text-white">
                                    Employee Information
                                </h4>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        placeholder="First and last name"
                                        {...register("fullName", { required: "Full Name is required" })}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white">Department</label>
                                    <select
                                        name="department"
                                        {...register("department", { required: "Department is required" })}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white"
                                    >
                                        <option value="">Select a department</option>
                                        {departmentsList.map((dept, index) => (
                                            <option key={index} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.department && <p className="text-red-500 text-xs italic">{errors.department.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="jobTitle">Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        id="jobTitle"
                                        placeholder="Head of IT"
                                        {...register("jobTitle", { required: "Job Title is required" })}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white"
                                    />
                                    {errors.jobTitle && <p className="text-red-500 text-xs italic">{errors.jobTitle.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white">Technologies</label>
                                    <div className="flex flex-wrap items-center border rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white">
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
                                            getSuggestionValue={suggestion => suggestion}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={stackInputProps}
                                            theme={theme}
                                            onSuggestionSelected={(event, { suggestion }) => handleStackTagClick(suggestion)}
                                        />
                                    </div>
                                </div>
                            </Card>
                            <button
                                type="submit"
                                className="justify-self-center w-full flex items-center justify-center sm:block bg-gray-700 hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 py-3.5 px-32 text-white rounded-lg mt-8 sm:mt-10 hover:cursor-pointer"
                            >
                                Create
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MyForm;
