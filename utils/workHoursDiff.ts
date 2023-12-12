export default function (workHour: string): number {
    const isFormatCorrect = (/^([01][0-9]|2[0-3]):[0-5][0-9]$/).test(workHour)
    if (!isFormatCorrect) {
        throw new Error("string format in workHour parameter in workHoursDiff isn't correct")
    }

    const [hours, minutes] = workHour.split(":").map(x => parseInt(x))
    const actualTime = new Date()
    const supposedTime = new Date()
    supposedTime.setHours(hours)
    supposedTime.setMinutes(minutes)

    return Math.ceil((actualTime.getTime() - supposedTime.getTime()) / 1000 / 60)
}