import React from 'react';
import Modal from './Modal';
import Card from '../../../components/card';

const ContestDetailsModal = ({ isOpen, onClose, contest }) => {
  if (!contest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card extra={"w-full h-full p-6"}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white mb-4">
            {contest.contestName}
          </h2>
          <div className="grid grid-cols-1 gap-4 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Company Name:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Industry:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.industry}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Locations:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.locations}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Deadline:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.deadline.split('T')[0]}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Contest Owner:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.contestOwner}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Department:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.department}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Draft Contest:</h3>
              <p className="text-sm text-navy-700 dark:text-white whitespace-pre-line">{contest.draftContest}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Awards:</h3>
              <p className="text-sm text-navy-700 dark:text-white">{contest.awards}</p>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ContestDetailsModal;
