import  { useEffect, useState } from 'react';
import CalendarComponent from './components/Calendar/CalendarComponent';
import PastComponent from './components/Past/PastComponent';
import PlanComponent from './components/Plan/PlanComponent';
import IndexedDBManager from './service/db/IndexedDBManager';

const dbManager = new IndexedDBManager();
function App() {
  
  useEffect(() => {
    const openDB = async () => {
      await dbManager.openDB();
    };
    openDB();
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pastComponentKey, setPastComponentKey] = useState(0); // State variable to force re-render


  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  const handleUpdateType = (planId: string, type: string, method : string) => {
    if(method==='update'){
      dbManager
        .updateType(planId, type)
        .then(() => {
          // Update the key to trigger the re-render of the PastComponent
          setPastComponentKey((prevKey) => prevKey + 1);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if(method==='delete'){
      dbManager
        .deletePlan(planId);
    }
  };

  return (
    <>
      <CalendarComponent selectedDate={selectedDate} onDateChange={handleDateChange} />
      <PlanComponent selectedDate={selectedDate} dbManager={dbManager} onUpdateType={handleUpdateType}/>
      <PastComponent key={pastComponentKey} selectedDate={selectedDate} dbManager={dbManager} onUpdateType={handleUpdateType}/>
    </>
  );
}

export default App;
