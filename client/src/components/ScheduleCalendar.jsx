import { useEffect, useState } from "react";

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import axios from "axios";

export function ScheduleCalendar({ schedule, setSchedule, reloadSchedule, scheduleRef, setScheduleDay, goals }) {
    const [events, setEvents] = useState([])
    // const [scrollTime, setScrollTime] = useState(format(new Date(), "HH:mm:ss"))

    useEffect(() => {
      setEvents(schedule.map((task) => {
        return {
          id: task._id,
          title: task.taskName,
          start: format(new Date(task.taskStart), "yyyy-MM-dd'T'HH:mm:ss"),
          end: format(new Date(task.taskEnd), "yyyy-MM-dd'T'HH:mm:ss"),
          color: goals.filter((goal) => goal._id == task.goalId)[0]?.color
        }
      }))
    }, [schedule]);

    function handleEventChange(changeInfo) {
      const event = changeInfo.event;
      const data = {
        taskId: event.id,
        newStart: event.start,
        newEnd: event.end,
      }
      
      axios.post("/api/edit-scheduled-task", data).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log("ERROR: ", error)
      })
    }

    return <div className="schedule-container">
      <div className="inner-schedule-container">
        <FullCalendar
          ref={scheduleRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          scrollTime={format(new Date(), "HH:mm:ss")}
          allDaySlot={false}
          // slotMinTime="09:00:00"
          // slotMaxTime="22:00:00"
          slotDuration="00:15:00"
          snapDuration="00:15:00"
          nowIndicator={true}
          editable={true}
          eventChange={handleEventChange}
          datesSet={(info) => {setScheduleDay(Math.floor(info.start.getTime()/86400000));}} //!
          // selectable={true}
          events={events}
          eventContent={(arg) => {
            return (
              <div>
                <strong>{arg.event.title}</strong>
                <br />
                {arg.timeText}
              </div>
            );
          }}
        />
      </div>
    </div>
}