import React from 'react'
import {CalendarDays, Clock, MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import {SessionCardDetails} from "@/types/entityTypes";
import {useRouter} from "next/navigation";

interface SessionCardProps {
    session:SessionCardDetails;
    eventId:number;
}
const SessionCard = ({session,eventId}:SessionCardProps) => {

    const router = useRouter();

    const routeToCheckout = (eventId:number)=>{
        router.push(`/event/${eventId}/booking/session/${session.sessionId}`);
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                {/*card*/}
                <div className="relative bg-muted rounded-lg p-[20px] text-gray-950 w-full sm:w-[500px]">
                    <div className="flex items-center gap-4">
                        <div><CalendarDays strokeWidth={1.5}/></div>
                        <div className="text-[20px]">{session.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div><Clock strokeWidth={1.5}/></div>
                        <div className="text-[20px]">{session.time}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div><MapPin strokeWidth={1.5}/></div>
                        <div className="text-[20px]">{session.location}</div>
                    </div>
                    <div className="absolute right-[10px] bottom-[10px]">
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => routeToCheckout(eventId)}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SessionCard
