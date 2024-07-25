import dayjs, { Dayjs } from 'dayjs';

export const disabledDate = (current: Dayjs | null) => {
    return current ? current.isAfter(dayjs().endOf('day')) : false;
};