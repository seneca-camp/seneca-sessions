import { useEffect, useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';

import { useInterval } from '~/utils/interval-hook';
import { getPublicSchedules, PublicSchedule } from '~/models/schedule';
import { getSlots } from '~/models/slots';
import { Sessions } from '~/components/Sessions';
import Button from '~/components/ui/Button';

export const loader = async () => {
    return await getPublicSchedules();
};

export default function IndexRoute() {
    if (typeof document !== "undefined") {
        const revalidator = useRevalidator();
        const [shouldRevalidate, setShouldRevalidate] = useState(true)
        useEffect(() => window.addEventListener("focus", () => {
            setShouldRevalidate(true);
            revalidator.revalidate();
        }), [])
        useEffect(() => window.addEventListener("blur", () => setShouldRevalidate(false)), [])
        useInterval(revalidator.revalidate, shouldRevalidate ? 5000 : null);
    }

    const schedules = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultSchedule = schedules.find(schedule => schedule.id === searchParams.get('schedule')) || schedules[schedules.length - 1];
    const [chosenSchedule, setChosenSchedule] = useState<PublicSchedule>(defaultSchedule);

    return (
        <main className="overflow-x-auto">
            {!chosenSchedule && <h1 className="text-white text-center my-8">No sessions :'(</h1>}
            {chosenSchedule && <>
                <div className="flex flex-row justify-center content-center items-center gap-2 mb-4">
                    {schedules.map((schedule, i) => (
                        <Button
                            variant={chosenSchedule.id === schedule.id ? 'solid' : 'outline'}
                            color="primary"
                            size="md"
                            onClick={() => {
                                setChosenSchedule(schedule);
                                const newSearchParams = new URLSearchParams(searchParams);
                                newSearchParams.set('schedule', schedule.id);
                                setSearchParams(newSearchParams);
                            }}
                            className="font-cronos"
                        >
                            {schedule.name}
                        </Button>
                    ))}
                </div>
                <Sessions slots={getSlots(chosenSchedule)} sessions={chosenSchedule.sessions} />
            </>}
        </main>
    );
}
