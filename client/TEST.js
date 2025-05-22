import * as chrono from 'chrono-node';
import { format } from 'date-fns';

const date = chrono.parseDate("end of day today")
const formatted = format(date, "MMMM d, h:mma", { timeZone: 'UTC' })
console.log(formatted)
