import { useEffect, useState, useRef } from "react";

import { ScheduleSidebar } from "./components/ScheduleSidebar";
import { ScheduleCalendar } from "./components/ScheduleCalendar";


export function Schedule({ goals, schedule, setSchedule, reloadSchedule, scheduleDay, setScheduleDay, reloadGoals }) {
  const scheduleRef = useRef();
  const [scheduleApi, setScheduleApi] = useState();

  // useEffect(() => {
  //   if (scheduleRef.current) {
  //     console.log("YIPPEE")
  //     setScheduleApi(scheduleRef.current.useApi);
  //   }

  // }, []);
  // // console.log(scheduleApi.getDate())
  // if (scheduleApi) {
  //   console.log("AHHH")
  //   console.log(scheduleApi.getDate())
  // }

  return <div className="schedule-wrapper">
    <ScheduleSidebar setSchedule={setSchedule} scheduleDay={scheduleDay} reloadSchedule={reloadSchedule} reloadGoals={reloadGoals} goals={goals} schedule={schedule} scheduleApi={scheduleApi} />
    <ScheduleCalendar schedule={schedule} setScheduleDay={setScheduleDay} goals={goals} setSchedule={setSchedule} reloadSchedule={reloadSchedule} scheduleRef={scheduleRef} scheduleApi={scheduleApi} />
  </div>
}
