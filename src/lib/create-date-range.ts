import dayjs from 'dayjs';

export function createDateRange(unit: dayjs.OpUnitType) {
    return {
        start: dayjs().startOf(unit).toDate(),
        end: dayjs().endOf(unit).toDate(),
    };
}
