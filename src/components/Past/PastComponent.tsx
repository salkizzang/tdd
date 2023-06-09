import React, { useState, useEffect } from 'react';
import IndexedDBManager from '../../service/db/IndexedDBManager';

type Past = {
    id: string;
    text: string;
    date: string;
    type: string;
};

type PastComponentProps = {
  selectedDate: Date | null;
  dbManager: IndexedDBManager;
  onUpdateType: (planId: string, type: string, method : string) => void;
};

const PastComponent: React.FC<PastComponentProps> = ({ selectedDate, dbManager, onUpdateType }) => {
  const [pastContent, setPastContent] = useState('');
  const [pastForSelectedDate, setPastForSelectedDate] = useState<any[]>([]);

  useEffect(() => {
    const fetchPast = async () => {
      if (selectedDate) {
        fetchPastForSelectedDate();
      }
    };
    fetchPast();
  }, [selectedDate]);


  const fetchPastForSelectedDate = async () => {
    try {
      const dateKey = selectedDate?.toLocaleDateString() ?? '';
        dbManager.listByPast(dateKey).then(res=>{
            setPastForSelectedDate(res);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlanChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    console.log(newText);
    setPastContent(newText);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && pastContent.trim() !== '') {
      event.preventDefault(); 
      const newPlan: Past = {
        id: Date.now().toString(),
        text: pastContent,
        date: selectedDate?.toLocaleDateString() ?? '',
        type: 'past'
      };
      dbManager.addData(newPlan);
      setPastContent('');
      fetchPastForSelectedDate();
    }
  };

  const handleDeleteButtonClick = (planId : string) =>{
    onUpdateType(planId, 'past', 'delete');
    fetchPastForSelectedDate();
  }

  return (
    <>
      {selectedDate && selectedDate <= new Date() && (
        <div className="past-component">
           <input
            type="text"
            value={pastContent}
            onChange={handlePlanChange}
            onKeyPress={handleKeyPress}
            placeholder="Please enter the exercise content."
            className="past-input"
          />
          <div>
             {pastForSelectedDate.map((past) => (
              <div key={past.id}>{past.text}
              <button className="delete-past-btn" onClick={() => handleDeleteButtonClick(past.id)} data-testid={`delete-past-btn-${past.text}`}>Delete</button></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PastComponent;
