import React, { useState, useEffect } from 'react';
import IndexedDBManager from '../../service/db/IndexedDBManager';

type Plan = {
    id: string;
    text: string;
    date: string;
    type: string;
  };

type PlanComponentProps = {
  selectedDate: Date | null;
  dbManager: IndexedDBManager;
  onUpdateType: (planId: string, type: string, method : string) => void;
};

const PlanComponent: React.FC<PlanComponentProps> = ({ selectedDate, dbManager, onUpdateType }) => {
  const [plan, setPlan] = useState('');
  const [plansForSelectedDate, setPlansForSelectedDate] = useState<any[]>([]);
  const selectedDay = selectedDate?.setHours(0, 0, 0, 0);
  const today = new Date().setHours(0,0,0,0);
  useEffect(() => {
    const fetchPlans = async () => {
      if (selectedDate) {
        fetchPlansForSelectedDate();
      }
    };
    fetchPlans();
  }, [selectedDate]);


  const fetchPlansForSelectedDate = async () => {
    try {
      const dateKey = selectedDate?.toLocaleDateString() ?? '';
        dbManager.listByFuture(dateKey).then(res=>{
            setPlansForSelectedDate(res);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlanChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    console.log(newText);
    setPlan(newText);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && plan.trim() !== '') {
      event.preventDefault(); 
      const newPlan: Plan = {
        id: Date.now().toString(),
        text: plan,
        date: selectedDate?.toLocaleDateString() ?? '',
        type: 'plan'
      };
      dbManager.addData(newPlan);
      setPlan('');
      fetchPlansForSelectedDate();
    }
  };

    const handleCheckButtonClick = (planId: string) => {
        onUpdateType(planId, 'past', 'update'); // Call the onUpdateType callback with the planId and type
        fetchPlansForSelectedDate();
    };

    const handleDeleteButtonClick = (planId : string) =>{
        onUpdateType(planId, 'past', 'delete');
        fetchPlansForSelectedDate();
    }

  return (
    <>
      {selectedDate && selectedDay && selectedDay >= today && (
        <div className="plan-component">
           <input
            type="text"
            value={plan}
            onChange={handlePlanChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your plan"
            className="plan-input"
          />
          <div>
             {plansForSelectedDate.map((plan) => (
              <div key={plan.id}>{plan.text}
              <button className="check-btn" onClick={() => handleCheckButtonClick(plan.id)} data-testid={`check-btn-${plan.text}`}>Check</button>
              <button className="delete-plan-btn" onClick={() => handleDeleteButtonClick(plan.id)} data-testid={`delete-plan-btn-${plan.text}`}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
  
};

export default PlanComponent;
