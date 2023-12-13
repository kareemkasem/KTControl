export default function (workHour: string, comparedWorkHour?: string, outputFormat: "hours" | "minutes" = "minutes"): number {
    const isFormatCorrect = (/^([01][0-9]|2[0-3]):[0-5][0-9]$/).test(workHour)
    if (!isFormatCorrect) {
        throw new Error("string format in workHour parameter in workHoursDiff isn't correct")
    }
    const [hours, minutes] = workHour.split(":").map(x => parseInt(x))

    const actualTime = new Date()

    if (comparedWorkHour) {
        const isFormatCorrect = (/^([01][0-9]|2[0-3]):[0-5][0-9]$/).test(workHour)
        if (!isFormatCorrect) {
            throw new Error("string format in comparedWorkHour parameter in workHoursDiff isn't correct")
        }
        const [hours, minutes] = comparedWorkHour.split(":").map(x => parseInt(x))
        actualTime.setHours(hours)
        actualTime.setMinutes(minutes)
    }

    const supposedTime = new Date()
    supposedTime.setHours(hours)
    supposedTime.setMinutes(minutes)

    if (outputFormat === "hours") {
        const diff = (actualTime.getTime() - supposedTime.getTime()) / 1000 / 60 / 60
        return parseFloat(diff.toFixed(2))
    } else {
        return Math.round((actualTime.getTime() - supposedTime.getTime()) / 1000 / 60)
    }
}