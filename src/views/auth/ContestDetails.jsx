import React, { useState } from 'react';
import Card from "../../components/card";
import { MdArrowBack } from "react-icons/md";
import ContestDetailsModal from './ContestDetailsModal';
import ContestSubmissionsTable from './ContestSubmissionsTable';

const ContestDetails = ({ contest, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-8">
      <Card extra={"w-full h-full px-6 pb-6"}>
        <div className="relative flex items-center justify-between pt-4">
          <button
            className="flex items-center text-navy-700 dark:text-white"
            onClick={onBack}
          >
            <MdArrowBack className="mr-2 text-2xl" />
            <span className="text-xl font-bold">Back</span>
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-navy-700 dark:text-white underline cursor-pointer" onClick={handleOpenModal}>
            {contest.contestName}
          </div>
        </div>
        <div className="mt-4">
          <ContestSubmissionsTable contestId={contest._id} />
        </div>
      </Card>
      {isModalOpen && (
        <ContestDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} contest={contest} />
      )}
    </div>
  );
};

export default ContestDetails;
