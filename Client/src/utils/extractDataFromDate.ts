export default function extractDataFromDate(date:string, type:string){
    const stringArray = String(date).split(" ")
    switch(type){
        case "day":
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            const index = shortDays.findIndex((day) => day === stringArray[0]);
            return days[index];
        case "month":
            const months: any = {
                Jan: 'January',
                Feb: 'February',
                Mar: 'March',
                Apr: 'April',
                May: 'May',
                Jun: 'June',
                Jul: 'July',
                Aug: 'August',
                Sep: 'September',
                Oct: 'October',
                Nov: 'November',
                Dec: 'December',
              };
              return months[stringArray[1]] || 'Invalid Month';
        case "date":
            return stringArray[2]
        case "year":
            return stringArray[3]
        default:
            return date
    }
}