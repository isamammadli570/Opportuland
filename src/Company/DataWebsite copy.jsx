import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { stackList } from '../helperList/StackList';
import { industryList } from '../helperList/Industry';
import { departmentsList } from '../helperList/Departments';
import Autosuggest from "react-autosuggest";
import axios from 'axios';
import Loading from "../dashboard/Loading";
import { useNavigate } from "react-router-dom";

// Təklifləri filter etmək üçün funksiya (stackList üçün)
const getStackSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : stackList.filter(
        suggestion => suggestion.toLowerCase().slice(0, inputLength) === inputValue
    );
};

// Təklifi göstərmək üçün funksiya
const renderSuggestion = (suggestion, { query, isHighlighted }) => (
    <div className={`p-2 m-1 ${isHighlighted ? 'bg-gray-200' : 'bg-white'} border rounded cursor-pointer`}>
        {suggestion}
    </div>
);

function MyForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        selections: [],
        industry: "",
        department: "",
        companyInfo: "",
        productsServices: ""
    });

    const [stackValue, setStackValue] = useState('');
    const [stackSuggestionsList, setStackSuggestionsList] = useState([]);

    useEffect(() => {
        const companyData = localStorage.getItem("companyData");
        if (companyData) {
            const parsedCompanyData = JSON.parse(companyData);
            setFormData((prevState) => ({
                ...prevState,
                companyInfo: parsedCompanyData.company_info || "",
                productsServices: parsedCompanyData.products_services || "",
                industry: parsedCompanyData.industry || ""
            }));
        } else {
            const webData = localStorage.getItem("webData");
            if (webData) {
                const parsedWebData = JSON.parse(webData);
                if (parsedWebData?.text) {
                    const parsedText = JSON.parse(parsedWebData.text);
                    setFormData((prevState) => ({
                        ...prevState,
                        companyInfo: parsedText?.company_info?.text || parsedText?.company_info || "",
                        productsServices: parsedText?.products_services?.text || parsedText?.products_services || "",
                    }));
                } else if (parsedWebData?.company_info) {
                    setFormData((prevState) => ({
                        ...prevState,
                        companyInfo: parsedWebData.company_info || "",
                        productsServices: parsedWebData.products_services || "",
                    }));
                }
            }
        }
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        const webData = localStorage.getItem("webData");
        const parsedWebData = webData ? JSON.parse(webData) : {};
        const webDataLinks = localStorage.getItem("webDataLinks");
        const parsedWebDataLinks = webDataLinks ? JSON.parse(webDataLinks) : {};

        // Combine formData and localStorage data
        const dataToSend = {
            ...formData,
            ...parsedWebData
        };

        try {
            // Send data to backend
            const formData = localStorage.getItem("formData");
            const parsedFormData = formData ? JSON.parse(formData) : {};
            const response = await axios.post(`${import.meta.env.VITE_HOST}/auth/createCompany`, { dataToSend, parsedWebDataLinks, parsedFormData });
            console.log('Data successfully sent:', response.data?.text);
            localStorage.removeItem("companyData");
            localStorage.removeItem("webData");
            localStorage.removeItem("webDataLinks");
            localStorage.removeItem("formData");
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error('Error sending data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleStackTagClick = (suggestion) => {
        setFormData((prevState) => ({
            ...prevState,
            selections: prevState.selections ? [...prevState.selections, suggestion] : [suggestion],
        }));
        setStackValue('');
    };

    const handleStackTagRemove = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            selections: prevState.selections.filter((_, i) => i !== index)
        }));
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
        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    };

    const theme = {
        container: 'relative',
        input: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
        suggestionsContainer: 'absolute z-10 w-full bg-white border border-gray-300 rounded mt-1',
        suggestionsList: 'flex flex-wrap',
        suggestion: 'p-2 m-1 bg-white border rounded hover:bg-gray-200 cursor-pointer',
        suggestionHighlighted: 'bg-gray-200'
    };

    return (
        <div className="flex h-full w-full">
        <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
          <main
            className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
          >
            <div className="h-full">
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 w-[70%] m-auto my-6">
        {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="name"
                >
                    Company Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="user name"
                    {...register("name", { required: "Company Name is required" })}
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="companyInfo"
                >
                    Company About
                </label>
                <textarea
                    name="companyInfo"
                    id="companyInfo"
                    {...register("companyInfo", { required: "Company About is required" })}
                    value={formData?.companyInfo}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
                {errors.companyInfo && <p className="text-red-500 text-xs italic">{errors.companyInfo.message}</p>}
            </div>
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="productsServices"
                >
                    Products and Services
                </label>
                <textarea
                    name="productsServices"
                    id="productsServices"
                    {...register("productsServices", { required: "Products and Services is required" })}
                    value={formData?.productsServices}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
                {errors.productsServices && <p className="text-red-500 text-xs italic">{errors.productsServices.message}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                    Technologies
                </label>
                <div className="flex flex-wrap items-center border rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                    {formData.selections?.map((selection, index) => (
                        <div key={index} className="flex items-center bg-blue-200 text-blue-800 p-1 m-1 rounded">
                            {selection}
                            <button
                                type="button"
                                onClick={() => handleStackTagRemove(index)}
                                className="ml-2 text-red-600"
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
            <div className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                    Industry
                </label>
                <select
                    name="industry"
                    {...register("industry", { required: "Industry is required" })}
                    value={formData.industry}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select an industry</option>
                    {industryList.map((industry, index) => (
                        <option key={index} value={industry}>{industry}</option>
                    ))}
                </select>
                {errors.industry && <p className="text-red-500 text-xs italic">{errors.industry.message}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                    Department
                </label>
                <select
                    name="department"
                    {...register("department", { required: "Department is required" })}
                    value={formData.department}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select a department</option>
                    {departmentsList.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                    ))}
                </select>
                {errors.department && <p className="text-red-500 text-xs italic">{errors.department.message}</p>}
            </div>

            <button
                type="submit"
                className="justify-self-center w-full flex items-center justify-center sm:block bg-gray-700 hover:bg-gray-600 py-3.5 px-32 text-white rounded-lg mt-8 sm:mt-10 hover:cursor-pointer"
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
