import { useEffect, useState } from "react";

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export function Schedule() {

  return <>
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      allDaySlot={false}
    //   slotMinTime="09:00:00"
    //   slotMaxTime="22:00:00"
      editable={true}
      events={[
        {
          id: '1',
          title: 'Event',
        },
      ]}
    />
  </>
}
