import React from 'react';

const ButtonRadio = ({ selectedOption, onOptionChange }) => {

  const handleRadioChange = (e) => {
    onOptionChange(e.target.value);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex">
        <label
          className={`cursor-pointer inline-block px-6 py-3 border-2 border-r-0 first:border-r-2 first:rounded-l-md last:rounded-r-md ${
            selectedOption === 'Employer'
              ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white'
              : 'bg-white text-orange-500 border-orange-500'
          } transition-transform transform hover:scale-105 duration-300`}
        >
          <input
            type="radio"
            name="option"
            value="Employer"
            checked={selectedOption === 'Employer'}
            onChange={handleRadioChange}
            className="hidden"
          />
          Company
        </label>
        <label
          className={`cursor-pointer inline-block px-6 py-3 border-2 border-l-0 last:border-l-2 first:rounded-l-md last:rounded-r-md ${
            selectedOption === 'Applicant'
              ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white'
              : 'bg-white text-orange-500 border-orange-500'
          } transition-transform transform hover:scale-105 duration-300`}
        >
          <input
            type="radio"
            name="option"
            value="Applicant"
            checked={selectedOption === 'Applicant'}
            onChange={handleRadioChange}
            className="hidden"
          />
          Applicant
        </label>
      </div>
    </div>
  );
};

export default ButtonRadio;
